import { ForbiddenException } from '@nestjs/common';

export class AccessDaniedException extends ForbiddenException {
  constructor() {
    super('Acesso Negado');
  }
}
