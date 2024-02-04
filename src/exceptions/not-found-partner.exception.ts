import { NotFoundException } from '@nestjs/common';

export class NotFoundPartnerException extends NotFoundException {
  constructor() {
    super('Empresa não encontrada');
  }
}
