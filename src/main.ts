import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './exception-filter/not-found.exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  let app: INestApplication;

  if (process.env.NODE_ENV === 'development') {
    const httpsOptions = {
      key: fs.readFileSync('./secrets/private-key.pem'),
      cert: fs.readFileSync('./secrets/public-certificate.pem'),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    app = await NestFactory.create(AppModule);
  }
  app.enableCors({
    origin: '*', // Permite requisições de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
    .addTag('Endereços')
    .addTag('Estatísticas')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000, '0.0.0.0');
}
bootstrap();
