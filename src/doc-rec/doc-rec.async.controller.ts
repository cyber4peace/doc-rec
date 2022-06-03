import { Controller, Body, Post, UseGuards, Get, Param, Res } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { AuthenticationGuard } from '../authentication/authentication.guard';

@UseGuards(AuthenticationGuard)
@Controller('doc-rec')
export class DocumentRecognitionAsyncController {
  constructor(@InjectQueue('doc-rec') private readonly queue: Queue) {}

  @Post('runAsync')
  async run(@Body() body: { }) {
    const job = await this.queue.add('run', body);
    return {
      jobId: job.id
    };
  }

  @Get('doc-rec/:id')
  async getResult(@Res({ passthrough: true }) response: any, @Param('id') id: string) {
    const job = await this.queue.getJob(id);
    if (!job) {
      response.status(404);
      return;
    }  
    const isCompleted = await job.isCompleted();  
    if (!isCompleted) {
      response.status(202);
      return;
    }
    return job.returnvalue;
  }
}