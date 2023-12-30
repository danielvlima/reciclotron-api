import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';

@Catch(Prisma.PrismaClientKnownRequestError)
export class NotFoundException implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 'P2025') {
      response
        .status(404)
        .json(ResponseFactoryModule.generate('Elemento não encontrado'));
    } else {
      response.status(500).json(ResponseFactoryModule.generate('Erro interno'));
    }
  }
}
