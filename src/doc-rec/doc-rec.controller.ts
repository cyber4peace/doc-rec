import { Controller, Body, Post, UseGuards } from '@nestjs/common';

import { DocumentRecognitionService } from './doc-rec.service';
import { AuthenticationGuard } from '../authentication/authentication.guard';

@UseGuards(AuthenticationGuard)
@Controller('doc-rec')
export class DocumentRecognitionController {
  constructor(private readonly service: DocumentRecognitionService) {}

  @Post('run')
  async run(@Body() data: any) {
    return this.service.run(data);
  }
}
