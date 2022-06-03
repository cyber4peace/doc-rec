import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { AuthenticationModule } from '../authentication/authentication.module';
import { DocumentRecognitionAsyncController } from './doc-rec.async.controller';
import { DocumentRecognitionAsyncProcessor } from './doc-rec.async.processor';
import { DocumentRecognitionService } from './doc-rec.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'doc-rec',
    }),
    AuthenticationModule
  ],
  controllers: [DocumentRecognitionAsyncController],
  providers: [DocumentRecognitionAsyncProcessor, DocumentRecognitionService],
})
export class DocumentRecognitionAsyncModule {}
