import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InstagramScraper } from '../scraper/instagram.scraper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private scraper: InstagramScraper
  ) {}

  async login(username: string, password: string) {
    // Проверяем существующую сессию
    const existingSession = await this.prisma.session.findUnique({
      where: { username }
    });

    if (existingSession?.active) {
      // Пробуем использовать сохраненные cookies
      const isValid = await this.scraper.validateSession(existingSession.cookies);
      if (isValid) {
        return { success: true, message: 'Using existing session' };
      }
    }

    // Выполняем новый логин
    const cookies = await this.scraper.login(username, password);
    
    // Сохраняем/обновляем сессию
    await this.prisma.session.upsert({
      where: { username },
      update: { cookies, active: true },
      create: { username, cookies }
    });

    return { success: true, message: 'Logged in successfully' };
  }

  async getCurrentSession() {
    return this.prisma.session.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' }
    });
  }
}