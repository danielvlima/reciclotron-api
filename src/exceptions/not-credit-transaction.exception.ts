import { HttpException, HttpStatus } from '@nestjs/common';

export class NotCreditTransactionException extends HttpException {
  constructor() {
    super('A Transação não é do tipo Crédito', HttpStatus.FAILED_DEPENDENCY);
  }
}
