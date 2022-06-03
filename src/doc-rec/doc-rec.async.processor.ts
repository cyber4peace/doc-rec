import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { DocumentRecognitionService } from './doc-rec.service';
 
@Processor('doc-rec')
export class DocumentRecognitionAsyncProcessor {
  constructor(private readonly service: DocumentRecognitionService) {}
  
  @Process('run')
  async handle(job: Job) {
    try {
      return await this.service.run(job.data);
    }
    catch(e: any) {
      return { error: e.message }
    }
  }
}