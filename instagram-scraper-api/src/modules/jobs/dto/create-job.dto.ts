// create-job.dto.ts
import { IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';

export class CreateJobDto {
  @IsString()
  query: string;

  @IsEnum(['hashtag', 'keyword'])
  queryType: string;

  @IsNumber()
  @Min(1)
  @Max(50)
  videoLimit: number = 10;

  @IsNumber()
  @Min(1)
  @Max(20)
  commentLimit: number = 10;
}

