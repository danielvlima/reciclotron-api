import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientBalanceException extends HttpException {
  constructor() {
    super('Saldo insuficiente', HttpStatus.FAILED_DEPENDENCY);
  }
}
