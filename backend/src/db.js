const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let db;

function initDB() {
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, 'scraper.db');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('Connected to SQLite database at:', dbPath);
      createTables();
    }
  });
}

function createTables() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER,
        ig_id TEXT,
        url TEXT,
        description TEXT,
        FOREIGN KEY (job_id) REFERENCES jobs(id)
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id INTEGER,
        ig_id TEXT,
        author TEXT,
        text TEXT,
        posted_at DATETIME,
        FOREIGN KEY (video_id) REFERENCES videos(id)
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment_id INTEGER,
        relevant BOOLEAN,
        ai_response TEXT,
        FOREIGN KEY (comment_id) REFERENCES comments(id)
      )
    `);
  });
}

function getDB() {
  return db;
}

module.exports = { initDB, getDB };