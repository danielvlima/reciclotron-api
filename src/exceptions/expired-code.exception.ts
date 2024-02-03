import { ForbiddenException } from '@nestjs/common';

export class ExpiredCodeException extends ForbiddenException {
  constructor() {
    super('Código expirado');
  }
}
