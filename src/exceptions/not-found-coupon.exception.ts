import { NotFoundException } from '@nestjs/common';

export class NotFoundCouponException extends NotFoundException {
  constructor() {
    super('Cupom não encontrado');
  }
}
