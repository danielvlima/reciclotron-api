import { HttpException, HttpStatus } from '@nestjs/common';

export class StatusNotEffectedUpdateTransactionException extends HttpException {
  constructor() {
    super(
      'O valor do novo status da Transação não é o valor Efetivada',
      HttpStatus.FAILED_DEPENDENCY,
    );
  }
}
