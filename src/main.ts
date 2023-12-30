import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundException } from './exceptions/not-found.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new NotFoundException());
  await app.listen(5000);
}
bootstrap();
