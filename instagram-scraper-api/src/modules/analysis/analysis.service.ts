import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AppLogger } from '../../utils/logger';
import { PROMPTS } from './prompts';

@Injectable()
export class AnalysisService {
  private openai: OpenAI;
  private logger = new AppLogger('AnalysisService');

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get('app.openai.apiKey'),
    });
  }

  async analyzeVideoRelevance(description: string): Promise<{
    relevant: boolean;
    confidence: number;
    reason: string;
  }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.get('app.openai.model'),
        messages: [
          { role: 'system', content: PROMPTS.RELEVANCE.system },
          { role: 'user', content: PROMPTS.RELEVANCE.user(description) },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      const content = response.choices[0].message.content;
      const result = JSON.parse(content);

      this.logger.debug(`Relevance analysis: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to analyze relevance', error.stack);
      // Fallback при ошибке
      return {
        relevant: false,
        confidence: 0,
        reason: 'Analysis failed',
      };
    }
  }

  async analyzeCommentsTone(comments: string[]): Promise<{
    tone: 'professional' | 'casual' | 'motivational';
    confidence: number;
    keywords: string[];
  }> {
    try {
      // Берем максимум 15 последних комментариев
      const recentComments = comments.slice(-15);

      const response = await this.openai.chat.completions.create({
        model: this.config.get('app.openai.model'),
        messages: [
          { role: 'system', content: PROMPTS.TONE.system },
          { role: 'user', content: PROMPTS.TONE.user(recentComments) },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      const content = response.choices[0].message.content;
      const result = JSON.parse(content);

      this.logger.debug(`Tone analysis: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to analyze tone', error.stack);
      // Fallback
      return {
        tone: 'casual',
        confidence: 0.5,
        keywords: [],
      };
    }
  }

  async generateComment(
    tone: 'professional' | 'casual' | 'motivational',
    context: string
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.get('app.openai.model'),
        messages: [
          { role: 'system', content: PROMPTS.GENERATE.system(tone) },
          { role: 'user', content: PROMPTS.GENERATE.user(context, tone) },
        ],
        temperature: 0.7,
        max_tokens: 50,
      });

      let comment = response.choices[0].message.content.trim();
      
      // Убираем кавычки если есть
      comment = comment.replace(/^["']|["']$/g, '');
      
      // Проверяем длину
      if (comment.length > 100) {
        comment = comment.substring(0, 97) + '...';
      }

      this.logger.debug(`Generated comment: "${comment}"`);
      return comment;
    } catch (error) {
      this.logger.error('Failed to generate comment', error.stack);
      throw error;
    }
  }

  // Дополнительный метод для батчевой обработки
  async analyzeMultipleComments(
    comments: Array<{ id: number; text: string; videoId: number }>
  ): Promise<Array<{
    commentId: number;
    videoId: number;
    relevant: boolean;
    sentiment: string;
    aiResponse: string;
  }>> {
    const results = [];

    // Группируем по видео
    const videoGroups = comments.reduce((acc, comment) => {
      if (!acc[comment.videoId]) {
        acc[comment.videoId] = [];
      }
      acc[comment.videoId].push(comment);
      return acc;
    }, {} as Record<number, typeof comments>);

    for (const [videoId, videoComments] of Object.entries(videoGroups)) {
      // Анализируем тональность группы
      const tone = await this.analyzeCommentsTone(
        videoComments.map(c => c.text)
      );

      // Генерируем ответ
      const aiResponse = await this.generateComment(
        tone.tone,
        videoComments[0].text // Используем первый комментарий как контекст
      );

      // Добавляем результаты
      for (const comment of videoComments) {
        results.push({
          commentId: comment.id,
          videoId: Number(videoId),
          relevant: true, // Если дошли до анализа, значит видео релевантно
          sentiment: tone.tone,
          aiResponse,
        });
      }
    }

    return results;
  }
}