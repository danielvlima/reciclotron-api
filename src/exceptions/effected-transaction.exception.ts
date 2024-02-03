import { HttpException, HttpStatus } from '@nestjs/common';

export class EffectedTransactionException extends HttpException {
  constructor() {
    super(
      'Transação já foi efetivada anteriormente',
      HttpStatus.FAILED_DEPENDENCY,
    );
  }
}
