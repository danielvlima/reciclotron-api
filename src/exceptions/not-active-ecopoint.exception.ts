import { HttpException, HttpStatus } from '@nestjs/common';

export class NotActiveEcopointException extends HttpException {
  constructor() {
    super('Ecoponto desativado', HttpStatus.FAILED_DEPENDENCY);
  }
}
