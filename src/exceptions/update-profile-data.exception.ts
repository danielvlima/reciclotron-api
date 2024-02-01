import { BadRequestException } from '@nestjs/common';

export class UpdateProfileDataException extends BadRequestException {
  constructor() {
    super('Email e/ou Telefone já cadastrado');
  }
}
