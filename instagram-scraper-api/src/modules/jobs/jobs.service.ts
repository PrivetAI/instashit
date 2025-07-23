import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InstagramScraper } from '../scraper/instagram.scraper';
import { AnalysisService } from '../analysis/analysis.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { delay } from '../utils/delay';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private scraper: InstagramScraper,
    private analysis: AnalysisService,
    private wsGateway: WebsocketGateway
  ) {}

  async createJob(data: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        query: data.query,
        queryType: data.queryType,
        videoLimit: data.videoLimit,
        commentLimit: data.commentLimit
      }
    });
  }

  async runJob(jobId: number) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Job not found');

    try {
      await this.updateJobStatus(jobId, 'in_progress');
      await this.log(jobId, 'info', 'Starting job...');

      // 1. Инициализация скрапера
      await this.scraper.init();
      await this.log(jobId, 'info', 'Browser initialized');

      // 2. Проверка/восстановление сессии
      const session = await this.prisma.session.findFirst({
        where: { active: true }
      });
      if (!session) {
        throw new Error('No active session. Please login first.');
      }

      await this.scraper.validateSession(session.cookies);
      await this.log(jobId, 'info', 'Session restored');

      // 3. Поиск reels
      await this.log(jobId, 'info', `Searching for ${job.videoLimit} reels...`);
      const reels = await this.scraper.searchReels(
        job.query, 
        job.queryType as 'hashtag' | 'keyword',
        job.videoLimit
      );
      await this.log(jobId, 'info', `Found ${reels.length} reels`);

      // 4. Обработка каждого reel
      for (let i = 0; i < reels.length; i++) {
        // Проверка на остановку
        const currentJob = await this.prisma.job.findUnique({ 
          where: { id: jobId } 
        });
        if (currentJob.stopped) {
          await this.log(jobId, 'warn', 'Job stopped by user');
          break;
        }

        const reel = reels[i];
        await this.log(jobId, 'info', `Processing reel ${i + 1}/${reels.length}`);

        // Проверка, не обработали ли уже
        const existingVideo = await this.prisma.video.findUnique({
          where: { igVideoId: reel.igVideoId }
        });

        if (existingVideo?.commented) {
          await this.log(jobId, 'info', 'Already commented, skipping...');
          continue;
        }

        // Получаем детали
        const details = await this.scraper.getReelDetails(reel.url);
        
        // Сохраняем видео
        const video = await this.prisma.video.upsert({
          where: { igVideoId: reel.igVideoId },
          update: { description: details.description },
          create: {
            jobId,
            igVideoId: reel.igVideoId,
            url: reel.url,
            description: details.description
          }
        });

        // Анализ релевантности
        const isRelevant = await this.analysis.analyzeVideoRelevance(
          details.description || ''
        );
        await this.prisma.video.update({
          where: { id: video.id },
          data: { isRelevant }
        });

        if (!isRelevant) {
          await this.log(jobId, 'info', 'Video not relevant, skipping...');
          continue;
        }

        // Сохраняем комментарии
        const lastComments = details.comments.slice(-job.commentLimit);
        for (const comment of lastComments) {
          await this.prisma.comment.create({
            data: {
              videoId: video.id,
              igCommentId: `${reel.igVideoId}_${Date.now()}`,
              text: comment.text,
              author: comment.author,
              postedAt: new Date()
            }
          });
        }

        // Анализ тональности
        const tone = await this.analysis.analyzeCommentsTone(
          lastComments.map(c => c.text)
        );
        await this.log(jobId, 'info', `Detected tone: ${tone}`);

        // Генерация комментария
        const generatedComment = await this.analysis.generateComment(
          tone,
          details.description || 'job search'
        );
        await this.log(jobId, 'info', `Generated: "${generatedComment}"`);

        // Публикация комментария
        try {
          await this.scraper.postComment(reel.url, generatedComment);
          await this.prisma.video.update({
            where: { id: video.id },
            data: { 
              commented: true,
              commentedAt: new Date()
            }
          });
          await this.log(jobId, 'success', 'Comment posted successfully');
        } catch (error) {
          await this.log(jobId, 'error', `Failed to post: ${error.message}`);
        }

        // Обновляем прогресс
        const progress = Math.round(((i + 1) / reels.length) * 100);
        await this.updateJobProgress(jobId, progress);

        // Задержка между действиями
        await delay(5000);
      }

      await this.updateJobStatus(jobId, 'completed');
      await this.log(jobId, 'success', 'Job completed');

    } catch (error) {
      await this.log(jobId, 'error', error.message);
      await this.updateJobStatus(jobId, 'failed');
    } finally {
      await this.scraper.close();
    }
  }

  async stopJob(jobId: number) {
    await this.prisma.job.update({
      where: { id: jobId },
      data: { stopped: true, status: 'stopped' }
    });
  }

  private async updateJobStatus(jobId: number, status: string) {
    await this.prisma.job.update({
      where: { id: jobId },
      data: { status }
    });
  }

  private async updateJobProgress(jobId: number, progress: number) {
    await this.prisma.job.update({
      where: { id: jobId },
      data: { progress }
    });
    this.wsGateway.sendProgress(jobId, progress);
  }

  private async log(jobId: number, level: string, message: string) {
    const log = await this.prisma.log.create({
      data: { jobId, level, message }
    });
    this.wsGateway.sendLog(jobId, log);
  }
}