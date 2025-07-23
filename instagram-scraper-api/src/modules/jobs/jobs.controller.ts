import { Controller, Post, Get, Param, Body, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

@ApiTags('jobs')
@Controller('api/jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new scraping job' })
  async create(@Body() dto: CreateJobDto) {
    const job = await this.jobsService.createJob(dto);
    
    // Запускаем асинхронно
    this.jobsService.runJob(job.id);
    
    return job;
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  async findAll() {
    return this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details' })
  async findOne(@Param('id') id: string) {
    return this.prisma.job.findUnique({
      where: { id: Number(id) },
      include: {
        videos: {
          include: {
            comments: {
              include: { analysis: true }
            }
          }
        },
        logs: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
  }

  @Put(':id/stop')
  @ApiOperation({ summary: 'Stop running job' })
  async stop(@Param('id') id: string) {
    return this.jobsService.stopJob(Number(id));
  }
}