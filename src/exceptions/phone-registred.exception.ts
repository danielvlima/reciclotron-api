import { NotFoundException } from '@nestjs/common';

export class CpfRegistredException extends NotFoundException {
  constructor() {
    super('CPF já cadastrado');
  }
}
