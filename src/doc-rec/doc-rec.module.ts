import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthenticationModule } from '../authentication/authentication.module';
import { DocumentRecognitionController } from './doc-rec.controller';
import { DocumentRecognitionService } from './doc-rec.service';

@Module({
  imports: [ AuthenticationModule, ConfigModule ],
  controllers: [ DocumentRecognitionController ],
  providers: [ DocumentRecognitionService ],
  exports: [ DocumentRecognitionService ],
})
export class DocumentRecognitionModule {}
