const puppeteer = require('puppeteer-core');
const { getDB } = require('./db');
const { analyzeComment, generateResponse } = require('./ai');
const { sleep, randomDelay, humanLikeMouseMove, humanLikeScroll } = require('./utils');

async function scrapeAndAnalyze(jobId, query) {
  const videoLimit = parseInt(process.env.VIDEO_LIMIT) || 10;
  const commentLimit = parseInt(process.env.COMMENT_LIMIT) || 20;
  
  console.log(`Starting scrape job ${jobId} for query: ${query}`);
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: process.env.CHROME_ENDPOINT,
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to hashtag page
    const url = `https://instagram.com/explore/tags/${encodeURIComponent(query)}/`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Wait for content to load
    await sleep(5000);
    
    // Check for captcha
    const captchaPresent = await page.$('input[name="captcha"]') !== null;
    if (captchaPresent) {
      console.log('Captcha detected, waiting for manual resolution...');
      const app = require('./index');
      app.setCaptchaWaiting(true);
      
      // Wait for captcha to be resolved
      while (await page.$('input[name="captcha"]') !== null) {
        await sleep(2000);
      }
      
      app.setCaptchaWaiting(false);
      console.log('Captcha resolved, continuing...');
    }
    
    // Collect video links
    const videos = await collectVideos(page, videoLimit);
    console.log(`Collected ${videos.length} videos`);
    
    // Process each video
    for (const video of videos) {
      await processVideo(page, jobId, video, commentLimit);
      await randomDelay(3000, 5000);
    }
    
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await page.close();
  }
}

async function collectVideos(page, limit) {
  const videos = [];
  let attempts = 0;
  
  while (videos.length < limit && attempts < 10) {
    // Get current video elements
    const videoElements = await page.$$('article a[href*="/reel/"]');
    
    for (const element of videoElements) {
      if (videos.length >= limit) break;
      
      const href = await element.evaluate(el => el.href);
      const videoId = href.match(/\/reel\/([^\/]+)/)?.[1];
      
      if (videoId && !videos.find(v => v.id === videoId)) {
        videos.push({ id: videoId, url: href });
      }
    }
    
    if (videos.length < limit) {
      // Scroll down to load more
      await humanLikeScroll(page);
      await randomDelay(2000, 3000);
      attempts++;
    }
  }
  
  return videos.slice(0, limit);
}

async function processVideo(page, jobId, video, commentLimit) {
  const db = getDB();
  
  console.log(`Processing video: ${video.url}`);
  
  // Navigate to video
  await page.goto(video.url, { waitUntil: 'networkidle2' });
  await randomDelay(3000, 5000);
  
  // Get video description
  const description = await page.$eval('meta[property="og:description"]', el => el.content).catch(() => '');
  
  // Save video to database
  const videoId = await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO videos (job_id, ig_id, url, description) VALUES (?, ?, ?, ?)',
      [jobId, video.id, video.url, description],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
  
  // Collect comments
  const comments = await collectComments(page, commentLimit);
  console.log(`Collected ${comments.length} comments for video ${video.id}`);
  
  // Process each comment
  for (const comment of comments) {
    await processComment(db, videoId, comment);
  }
}

async function collectComments(page, limit) {
  const comments = [];
  
  // Click on comments section if needed
  const viewCommentsBtn = await page.$('button[aria-label*="View all"]');
  if (viewCommentsBtn) {
    await humanLikeMouseMove(page, viewCommentsBtn);
    await viewCommentsBtn.click();
    await randomDelay(2000, 3000);
  }
  
  // Scroll through comments
  let attempts = 0;
  while (comments.length < limit && attempts < 10) {
    const commentElements = await page.$$('div[role="button"] > span > div');
    
    for (const element of commentElements) {
      if (comments.length >= limit) break;
      
      try {
        const author = await element.$eval('a', el => el.textContent).catch(() => 'Unknown');
        const text = await element.$eval('span[dir="auto"]', el => el.textContent).catch(() => '');
        
        if (text && !comments.find(c => c.text === text)) {
          comments.push({
            author,
            text,
            posted_at: new Date().toISOString()
          });
        }
      } catch (e) {
        // Skip malformed comments
      }
    }
    
    if (comments.length < limit) {
      await humanLikeScroll(page, 300);
      await randomDelay(1000, 2000);
      attempts++;
    }
  }
  
  return comments.slice(0, limit);
}

async function processComment(db, videoId, comment) {
  // Save comment
  const commentId = await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO comments (video_id, author, text, posted_at) VALUES (?, ?, ?, ?)',
      [videoId, comment.author, comment.text, comment.posted_at],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
  
  // Analyze comment
  const isRelevant = await analyzeComment(comment.text);
  let aiResponse = null;
  
  if (isRelevant) {
    aiResponse = await generateResponse(comment.text);
  }
  
  // Save analysis
  await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO analysis (comment_id, relevant, ai_response) VALUES (?, ?, ?)',
      [commentId, isRelevant ? 1 : 0, aiResponse],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = { scrapeAndAnalyze };