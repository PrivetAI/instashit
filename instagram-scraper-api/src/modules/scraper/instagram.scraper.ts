import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { AppLogger } from '../../utils/logger';
import { delay, randomDelay } from '../../utils/delay';

puppeteer.use(StealthPlugin());

@Injectable()
export class InstagramScraper {
  private browser: Browser;
  private page: Page;
  private logger = new AppLogger('InstagramScraper');

  constructor(private config: ConfigService) {}

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: this.config.get('app.puppeteer.headless'),
        executablePath: this.config.get('app.puppeteer.executablePath'),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-features=IsolateOrigins,site-per-process',
        ],
      });

      this.page = await this.browser.newPage();

      // Настройка user agent
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      );

      await this.page.setViewport({ width: 1280, height: 800 });

      // Блокировка ненужных ресурсов для ускорения
      await this.page.setRequestInterception(true);
      this.page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['image', 'stylesheet', 'font'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      this.logger.log('Browser initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize browser', error.stack);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<any> {
    try {
      await this.page.goto(`${this.config.get('app.instagram.baseUrl')}/accounts/login/`, {
        waitUntil: 'networkidle2',
      });

      await randomDelay(2000, 3000);

      // Закрываем cookie popup если есть
      try {
        await this.page.click('button:has-text("Allow essential and optional cookies")', { timeout: 3000 });
      } catch (e) {
        // Cookie popup не найден
      }

      // Ввод данных
      await this.page.waitForSelector('input[name="username"]');
      await this.page.type('input[name="username"]', username, { delay: 100 });
      
      await randomDelay(500, 1000);
      
      await this.page.type('input[name="password"]', password, { delay: 100 });
      
      await randomDelay(1000, 2000);

      // Клик по кнопке входа
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
        this.page.click('button[type="submit"]'),
      ]);

      await randomDelay(3000, 5000);

      // Проверка на 2FA
      const is2FA = await this.page.$('input[name="verificationCode"]');
      if (is2FA) {
        throw new Error('2FA_REQUIRED');
      }

      // Проверка успешного входа
      const profileIcon = await this.page.$('[aria-label="Profile"]');
      if (!profileIcon) {
        throw new Error('LOGIN_FAILED');
      }

      // Сохраняем cookies
      const cookies = await this.page.cookies();
      this.logger.log('Login successful');
      
      return cookies;
    } catch (error) {
      this.logger.error('Login failed', error.stack);
      throw error;
    }
  }

  async setCookies(cookies: any[]) {
    await this.page.setCookie(...cookies);
  }

  async validateSession(cookies: any[]): Promise<boolean> {
    try {
      await this.setCookies(cookies);
      await this.page.goto(this.config.get('app.instagram.baseUrl'), {
        waitUntil: 'networkidle2',
      });

      await randomDelay(2000, 3000);

      const profileIcon = await this.page.$('[aria-label="Profile"]');
      return !!profileIcon;
    } catch (error) {
      this.logger.error('Session validation failed', error.stack);
      return false;
    }
  }

  async searchReels(query: string, type: 'hashtag' | 'keyword', limit: number): Promise<any[]> {
    try {
      let url: string;
      if (type === 'hashtag') {
        const cleanQuery = query.replace('#', '');
        url = `${this.config.get('app.instagram.baseUrl')}/explore/tags/${cleanQuery}/`;
      } else {
        url = `${this.config.get('app.instagram.baseUrl')}/explore/search/keyword/?q=${encodeURIComponent(query)}`;
      }

      await this.page.goto(url, { waitUntil: 'networkidle2' });
      await randomDelay(3000, 4000);

      // Кликаем на вкладку Reels если есть
      try {
        await this.page.click('a[href*="/reels/"]', { timeout: 3000 });
        await randomDelay(2000, 3000);
      } catch (e) {
        // Вкладка reels не найдена
      }

      const reels = [];
      let scrollCount = 0;
      const maxScrolls = 15;

      while (reels.length < limit && scrollCount < maxScrolls) {
        // Собираем ссылки на reels
        const newReels = await this.page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a[href*="/reel/"]'));
          return links.map(link => {
            const href = (link as HTMLAnchorElement).href;
            const match = href.match(/\/reel\/([^\/\?]+)/);
            return {
              url: href.split('?')[0], // Убираем query params
              igVideoId: match ? match[1] : null,
            };
          }).filter(item => item.igVideoId);
        });

        // Добавляем только уникальные
        for (const reel of newReels) {
          if (!reels.find(r => r.igVideoId === reel.igVideoId)) {
            reels.push(reel);
            if (reels.length >= limit) break;
          }
        }

        // Скролл
        await this.page.evaluate(() => {
          window.scrollBy(0, window.innerHeight * 0.8);
        });

        await randomDelay(2000, 3000);
        scrollCount++;

        this.logger.debug(`Scroll ${scrollCount}: found ${reels.length} reels`);
      }

      return reels.slice(0, limit);
    } catch (error) {
      this.logger.error('Failed to search reels', error.stack);
      throw error;
    }
  }

  async getReelDetails(url: string): Promise<any> {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2' });
      await randomDelay(3000, 4000);

      // Ждем загрузки контента
      await this.page.waitForSelector('article', { timeout: 10000 });

      const details = await this.page.evaluate(() => {
        // Описание видео
        const descElement = document.querySelector('h1');
        const description = descElement?.textContent || '';

        // Собираем комментарии
        const comments = [];
        const commentElements = document.querySelectorAll('ul > div[role="button"]');

        commentElements.forEach(element => {
          const authorElement = element.querySelector('a span');
          const textElement = element.querySelector('span:not(a span)');
          
          if (authorElement && textElement) {
            const author = authorElement.textContent?.trim() || '';
            const text = textElement.textContent?.trim() || '';
            
            if (author && text && !text.includes('View replies')) {
              comments.push({ author, text });
            }
          }
        });

        return { description, comments };
      });

      this.logger.debug(`Found ${details.comments.length} comments`);
      return details;
    } catch (error) {
      this.logger.error('Failed to get reel details', error.stack);
      throw error;
    }
  }

  async postComment(url: string, text: string): Promise<boolean> {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2' });
      await randomDelay(3000, 4000);

      // Находим поле комментария
      const commentSelector = 'textarea[aria-label*="comment" i], textarea[placeholder*="comment" i]';
      await this.page.waitForSelector(commentSelector, { timeout: 10000 });

      // Кликаем на поле
      await this.page.click(commentSelector);
      await randomDelay(500, 1000);

      // Вводим текст
      await this.page.type(commentSelector, text, { delay: 100 });
      await randomDelay(1000, 2000);

      // Отправляем (Enter или кнопка Post)
      const postButton = await this.page.$('button[type="submit"]:has-text("Post")');
      if (postButton) {
        await postButton.click();
      } else {
        await this.page.keyboard.press('Enter');
      }

      await randomDelay(3000, 5000);

      // Проверяем, что комментарий появился
      const postedComment = await this.page.evaluate((commentText) => {
        const comments = Array.from(document.querySelectorAll('span')).filter(
          span => span.textContent?.includes(commentText)
        );
        return comments.length > 0;
      }, text);

      if (!postedComment) {
        throw new Error('Comment not posted');
      }

      this.logger.log('Comment posted successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to post comment', error.stack);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.logger.log('Browser closed');
    }
  }
}