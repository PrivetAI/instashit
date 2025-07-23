import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ScraperModule } from '../scraper/scraper.module';
import { AnalysisModule } from '../analysis/analysis.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [ScraperModule, AnalysisModule, WebsocketModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}