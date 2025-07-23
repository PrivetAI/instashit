import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import configuration from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    JobsModule,
    ScraperModule,
    AnalysisModule,
    WebsocketModule,
  ],
})
export class AppModule {}