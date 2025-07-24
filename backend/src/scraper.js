const puppeteer = require('puppeteer-core');
const { getDB } = require('./db');
const { analyzeComment, generateResponse } = require('./ai');
const { sleep, randomDelay, humanLikeMouseMove, humanLikeScroll, humanLikeType } = require('./utils');
const fs = require('fs').promises;
const path = require('path');

const COOKIES_PATH = path.join(__dirname, '../data/cookies.json');

async function getWSEndpoint() {
  if (!process.env.CHROME_ENDPOINT) {
    throw new Error('CHROME_ENDPOINT environment variable is required. Please set it in your .env file like: CHROME_ENDPOINT=ws://localhost:9222/devtools/browser/[browser-id]');
  }
  
  return process.env.CHROME_ENDPOINT;
}

async function saveCookies(page) {
  const cookies = await page.cookies();
  await fs.writeFile(COOKIES_PATH, JSON.stringify(cookies, null, 2));
  console.log('Cookies saved');
}

async function loadCookies(page) {
  try {
    const cookiesString = await fs.readFile(COOKIES_PATH, 'utf8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    console.log('Cookies loaded');
    return true;
  } catch (error) {
    console.log('No cookies found');
    return false;
  }
}

async function checkAuth(page, app) {
  // Navigate to Instagram
  await page.goto('https://instagram.com', { waitUntil: 'networkidle2' });
  await randomDelay(2000, 4000);
  
  // Check if we're logged in
  const isLoggedIn = await page.$('svg[aria-label="Home"]') !== null || 
                     await page.$('a[href="/direct/inbox/"]') !== null;
  
  if (!isLoggedIn) {
    console.log('Not logged in, waiting for manual login...');
    app.setAuthWaiting(true);
    
    // Wait for login
    while (true) {
      await sleep(2000);
      
      // Check if user marked as logged in from UI
      if (!app.getAuthWaiting()) {
        break;
      }
      
      // Also check if actually logged in
      const loggedIn = await page.$('svg[aria-label="Home"]') !== null || 
                       await page.$('a[href="/direct/inbox/"]') !== null;
      if (loggedIn) {
        break;
      }
    }
    
    app.setAuthWaiting(false);
    console.log('Login confirmed, saving cookies...');
    await saveCookies(page);
    await randomDelay(2000, 3000);
  } else {
    console.log('Already logged in');
  }
}

async function scrapeAndAnalyze(jobId, query) {
  const videoLimit = parseInt(process.env.VIDEO_LIMIT) || 10;
  const commentLimit = parseInt(process.env.COMMENT_LIMIT) || 20;
  
  console.log(`Starting scrape job ${jobId} for query: ${query}`);
  
  let browser;
  const app = require('./index');
  
  try {
    const wsEndpoint = await getWSEndpoint();
    console.log('Connecting to Chrome at:', wsEndpoint);
    
    browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
      defaultViewport: null
    });
    
    const page = await browser.newPage();
    
    // Set realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    try {
      // Load cookies if available
      const cookiesLoaded = await loadCookies(page);
      
      // Check authentication
      await checkAuth(page, app);
      
      // Random delay before navigation
      await randomDelay(1000, 3000);
      
      // Navigate to hashtag page
      const url = `https://instagram.com/explore/tags/${encodeURIComponent(query)}/`;
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Human-like wait
      await randomDelay(3000, 5000);
      
      // Check for captcha
      const captchaPresent = await page.$('input[name="captcha"]') !== null ||
                             await page.$('div[role="dialog"]') !== null;
      
      if (captchaPresent) {
        console.log('Captcha detected, waiting for manual resolution...');
        app.setCaptchaWaiting(true);
        
        // Wait for captcha to be resolved
        while (app.getCaptchaWaiting()) {
          await sleep(2000);
        }
        
        console.log('Captcha resolved, continuing...');
        await randomDelay(2000, 4000);
      }
      
      // Collect video links
      const videos = await collectVideos(page, videoLimit);
      console.log(`Collected ${videos.length} videos`);
      
      // Process each video
      for (const video of videos) {
        await processVideo(page, jobId, video, commentLimit);
        await randomDelay(5000, 10000); // Longer delay between videos
      }
      
      // Save cookies after successful scraping
      await saveCookies(page);
      
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    } finally {
      await page.close();
    }
  } catch (error) {
    console.error('Browser connection error:', error);
    throw error;
  }
}

async function collectVideos(page, limit) {
  const videos = [];
  let attempts = 0;
  let lastScrollPosition = 0;
  
  while (videos.length < limit && attempts < 10) {
    // Random wait before action
    await randomDelay(1000, 3000);
    
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
      // Human-like scroll
      const scrollDistance = 300 + Math.random() * 400;
      await humanLikeScroll(page, scrollDistance);
      
      // Sometimes scroll back up a bit
      if (Math.random() < 0.2) {
        await randomDelay(500, 1000);
        await humanLikeScroll(page, -100 - Math.random() * 100);
      }
      
      await randomDelay(2000, 4000);
      attempts++;
    }
  }
  
  return videos.slice(0, limit);
}

async function processVideo(page, jobId, video, commentLimit) {
  const db = getDB();
  
  console.log(`Processing video: ${video.url}`);
  
  // Human-like navigation
  await randomDelay(1000, 2000);
  await page.goto(video.url, { waitUntil: 'networkidle2' });
  await randomDelay(3000, 5000);
  
  // Sometimes pause video
  if (Math.random() < 0.3) {
    const videoElement = await page.$('video');
    if (videoElement) {
      await humanLikeMouseMove(page, videoElement);
      await videoElement.click();
      await randomDelay(500, 1500);
    }
  }
  
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
  
  // Random delay before interacting
  await randomDelay(1000, 2000);
  
  // Click on comments section if needed
  const viewCommentsBtn = await page.$('button[aria-label*="View all"]') ||
                          await page.$('button[aria-label*="comments"]');
  
  if (viewCommentsBtn) {
    await humanLikeMouseMove(page, viewCommentsBtn);
    await randomDelay(300, 800);
    await viewCommentsBtn.click();
    await randomDelay(2000, 3000);
  }
  
  // Scroll through comments
  let attempts = 0;
  let noNewCommentsCount = 0;
  
  while (comments.length < limit && attempts < 15 && noNewCommentsCount < 3) {
    const previousCount = comments.length;
    
    // Find comment elements
    const commentElements = await page.$$('div[role="button"] span[dir="auto"]');
    
    for (const element of commentElements) {
      if (comments.length >= limit) break;
      
      try {
        const text = await element.evaluate(el => el.textContent);
        
        // Get author - try parent elements
        const author = await element.evaluate(el => {
          const link = el.closest('div[role="button"]')?.querySelector('a');
          return link ? link.textContent : 'Unknown';
        }).catch(() => 'Unknown');
        
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
    
    // Check if we got new comments
    if (comments.length === previousCount) {
      noNewCommentsCount++;
    } else {
      noNewCommentsCount = 0;
    }
    
    if (comments.length < limit && noNewCommentsCount < 3) {
      // Human-like scroll
      const scrollDistance = 200 + Math.random() * 300;
      await humanLikeScroll(page, scrollDistance);
      
      // Sometimes pause scrolling
      if (Math.random() < 0.3) {
        await randomDelay(2000, 4000);
      } else {
        await randomDelay(1000, 2000);
      }
      
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