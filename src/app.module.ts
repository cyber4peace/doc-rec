import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DocumentRecognitionModule } from './doc-rec/doc-rec.module';
import { DocumentRecognitionAsyncModule } from './doc-rec/doc-rec.async.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local']
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
    DocumentRecognitionModule,
    DocumentRecognitionAsyncModule,
    AuthenticationModule,
  ],
})
export class AppModule { }
