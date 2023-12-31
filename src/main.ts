import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './exception-filter/not-found.exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new NotFoundExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Reciclotron API')
    .addTag('Usuários')
    .addTag('Transações')
    .addTag('Cupons comprados pelo Usuário')
    .addTag('Empresas Parceiras')
    .addTag('Cupons de Desconto')
    .addTag('Ecopontos')
    .addTag('Ações para Ecopontos')
    .addTag('Materiais')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);
}
bootstrap();
