import { ForbiddenException } from '@nestjs/common';

export class CodeUncheckedException extends ForbiddenException {
  constructor() {
    super('Código não verificado');
  }
}
