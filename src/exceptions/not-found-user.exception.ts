import { NotFoundException } from '@nestjs/common';

export class NotFoundUserException extends NotFoundException {
  constructor() {
    super('Usuário não encontrado');
  }
}
