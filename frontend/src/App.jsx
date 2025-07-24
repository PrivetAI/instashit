import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaWaiting, setCaptchaWaiting] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);

  // Poll for status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentJobId) {
        const statusRes = await axios.get(`${API_URL}/api/status`);
        setCaptchaWaiting(statusRes.data.captchaWaiting);
        
        if (statusRes.data.currentJob?.status !== 'running') {
          setCurrentJobId(null);
          loadJobs();
          if (selectedJob?.id === currentJobId) {
            loadJobDetails(currentJobId);
          }
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentJobId, selectedJob]);

  const loadJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      setJobs(res.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadJobDetails = async (jobId) => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs/${jobId}`);
      setSelectedJob(res.data);
    } catch (error) {
      console.error('Error loading job details:', error);
    }
  };

  const startScraping = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/scrape`, { query });
      setCurrentJobId(res.data.jobId);
      setQuery('');
      await loadJobs();
    } catch (error) {
      alert(error.response?.data?.error || 'Error starting scraping');
    } finally {
      setLoading(false);
    }
  };

  const resolveCaptcha = async () => {
    try {
      await axios.post(`${API_URL}/api/captcha/resolved`);
      setCaptchaWaiting(false);
    } catch (error) {
      console.error('Error resolving captcha:', error);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Instagram Scraper</h1>
      </header>

      <div className="container">
        {/* Captcha Alert */}
        {captchaWaiting && (
          <div className="captcha-alert">
            <p>⚠️ Captcha detected! Please solve it in the browser window.</p>
            <button onClick={resolveCaptcha}>I've solved the captcha</button>
          </div>
        )}

        {/* Search Form */}
        <div className="search-section">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter hashtag or keyword"
            onKeyPress={(e) => e.key === 'Enter' && startScraping()}
            disabled={loading || currentJobId}
          />
          <button 
            onClick={startScraping}
            disabled={loading || currentJobId || !query.trim()}
          >
            {loading ? 'Starting...' : 'Start Scraping'}
          </button>
        </div>

        <div className="main-content">
          {/* Jobs List */}
          <div className="jobs-list">
            <h2>Scraping History</h2>
            {jobs.length === 0 ? (
              <p>No jobs yet</p>
            ) : (
              <ul>
                {jobs.map(job => (
                  <li 
                    key={job.id} 
                    className={`job-item ${selectedJob?.id === job.id ? 'selected' : ''}`}
                    onClick={() => loadJobDetails(job.id)}
                  >
                    <span className="job-query">{job.query}</span>
                    <span className={`job-status ${job.status}`}>{job.status}</span>
                    <span className="job-date">
                      {new Date(job.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Job Details */}
          <div className="job-details">
            {selectedJob ? (
              <>
                <h2>Job Details: {selectedJob.query}</h2>
                <div className="videos-container">
                  {selectedJob.videos?.map(video => (
                    <div key={video.id} className="video-card">
                      <div className="video-header">
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          Video ID: {video.ig_id}
                        </a>
                        <p className="video-desc">{video.description}</p>
                      </div>
                      
                      <div className="comments-section">
                        <h3>Comments ({video.comments?.length || 0})</h3>
                        {video.comments?.map(comment => (
                          <div 
                            key={comment.id} 
                            className={`comment ${comment.analysis?.relevant ? 'relevant' : 'not-relevant'}`}
                          >
                            <div className="comment-header">
                              <strong>{comment.author}</strong>
                              <span className="comment-date">
                                {new Date(comment.posted_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                            
                            {comment.analysis?.relevant && (
                              <div className="ai-response">
                                <strong>AI Response:</strong>
                                <p>{comment.analysis.ai_response}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Select a job to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;