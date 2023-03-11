import { NestFactory } from '@nestjs/core';
import { useContainer } from 'typeorm';
import { AppModule } from './App/app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION')
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
