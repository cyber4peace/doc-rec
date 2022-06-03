import { Module } from '@nestjs/common';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';

@Module({
  providers: [
    AuthenticationGuard,
    AuthenticationService,
  ],
  exports: [
    AuthenticationService,
  ],
})
export class AuthenticationModule {}
