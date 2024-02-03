import { NotFoundException } from '@nestjs/common';

export class NotFoundEcopointException extends NotFoundException {
  constructor() {
    super('Ecoponto não encontrado');
  }
}
