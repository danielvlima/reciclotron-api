import { BadRequestException } from '@nestjs/common';

export class PasswordLengthException extends BadRequestException {
  constructor() {
    super('Senha muito pequena');
  }
}
