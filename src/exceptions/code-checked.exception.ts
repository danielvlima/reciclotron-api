import { ForbiddenException } from '@nestjs/common';

export class CodeCheckedException extends ForbiddenException {
  constructor() {
    super('Código já verificado');
  }
}
