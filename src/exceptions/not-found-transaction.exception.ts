import { NotFoundException } from '@nestjs/common';

export class NotFoundTransactionException extends NotFoundException {
  constructor() {
    super('Transação não encontrada');
  }
}
