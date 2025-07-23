import { Module } from '@nestjs/common';
import { InstagramScraper } from './instagram.scraper';

@Module({
  providers: [InstagramScraper],
  exports: [InstagramScraper],
})
export class ScraperModule {}