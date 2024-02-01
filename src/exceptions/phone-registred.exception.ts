import { BadRequestException } from '@nestjs/common';

export class PhoneRegistredException extends BadRequestException {
  constructor() {
    super('Telefone já cadastrado');
  }
}
