import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Document recognition')
    .setDescription('Document recognition')
    .setVersion('1.0')
    .addTag('doc-rec')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // By default, Fastify listens only on the localhost 127.0.0.1 interface (read more). 
  // If you want to accept connections on other hosts, you should specify '0.0.0.0' in the listen() call:
  // await app.listen(3002);
  app.enableCors();
  await app.listen(process.env.SERVICE_PORT || 3002, '0.0.0.0');
}
bootstrap();
