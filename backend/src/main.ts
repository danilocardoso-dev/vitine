import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Libera CORS para todos
  app.enableCors({
    origin: '*', // permite qualquer origem
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*', // permite qualquer header
  });

  await app.listen(3001);
}
bootstrap();