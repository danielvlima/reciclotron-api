import { BadRequestException } from '@nestjs/common';

export class CpfRegistredException extends BadRequestException {
  constructor() {
    super('CPF já cadastrado');
  }
}
