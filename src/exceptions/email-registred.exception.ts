import { BadRequestException } from '@nestjs/common';

export class EmailRegistredException extends BadRequestException {
  constructor() {
    super('Email já cadastrado');
  }
}
