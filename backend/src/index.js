const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const { scrapeAndAnalyze } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let captchaWaiting = false;
let currentJob = null;

// Initialize database
initDB();

// Get all jobs
app.get('/api/jobs', async (req, res) => {
  const db = require('./db').getDB();
  
  db.all('SELECT * FROM jobs ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get job details with videos, comments and analysis
app.get('/api/jobs/:id', async (req, res) => {
  const db = require('./db').getDB();
  const jobId = req.params.id;
  
  db.get('SELECT * FROM jobs WHERE id = ?', [jobId], (err, job) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    db.all(`
      SELECT 
        v.id as video_id,
        v.ig_id as video_ig_id,
        v.url as video_url,
        v.description as video_description,
        c.id as comment_id,
        c.ig_id as comment_ig_id,
        c.author as comment_author,
        c.text as comment_text,
        c.posted_at as comment_posted_at,
        a.relevant as analysis_relevant,
        a.ai_response as analysis_response
      FROM videos v
      LEFT JOIN comments c ON c.video_id = v.id
      LEFT JOIN analysis a ON a.comment_id = c.id
      WHERE v.job_id = ?
    `, [jobId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Group data by video
      const videos = {};
      rows.forEach(row => {
        if (!videos[row.video_id]) {
          videos[row.video_id] = {
            id: row.video_id,
            ig_id: row.video_ig_id,
            url: row.video_url,
            description: row.video_description,
            comments: []
          };
        }
        
        if (row.comment_id) {
          videos[row.video_id].comments.push({
            id: row.comment_id,
            ig_id: row.comment_ig_id,
            author: row.comment_author,
            text: row.comment_text,
            posted_at: row.comment_posted_at,
            analysis: {
              relevant: row.analysis_relevant,
              ai_response: row.analysis_response
            }
          });
        }
      });
      
      res.json({
        ...job,
        videos: Object.values(videos)
      });
    });
  });
});

// Start new scraping job
app.post('/api/scrape', async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  if (currentJob && currentJob.status === 'running') {
    return res.status(400).json({ error: 'Another job is already running' });
  }
  
  const db = require('./db').getDB();
  
  db.run('INSERT INTO jobs (query, status) VALUES (?, ?)', [query, 'running'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    const jobId = this.lastID;
    currentJob = { id: jobId, status: 'running' };
    
    // Start scraping in background
    scrapeAndAnalyze(jobId, query)
      .then(() => {
        db.run('UPDATE jobs SET status = ? WHERE id = ?', ['completed', jobId]);
        currentJob = null;
      })
      .catch(error => {
        console.error('Scraping error:', error);
        db.run('UPDATE jobs SET status = ? WHERE id = ?', ['failed', jobId]);
        currentJob = null;
      });
    
    res.json({ jobId, status: 'running' });
  });
});

// Get current job status
app.get('/api/status', (req, res) => {
  res.json({
    currentJob,
    captchaWaiting
  });
});

// Captcha endpoints
app.get('/api/captcha/status', (req, res) => {
  res.json({ waiting: captchaWaiting });
});

app.post('/api/captcha/resolved', (req, res) => {
  captchaWaiting = false;
  res.json({ success: true });
});

// Set captcha waiting (called by scraper)
app.setCaptchaWaiting = (waiting) => {
  captchaWaiting = waiting;
};

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

module.exports = app;