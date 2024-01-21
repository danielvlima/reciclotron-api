import { HttpException, HttpStatus } from '@nestjs/common';

export class NoCouponsAvailableException extends HttpException {
  constructor() {
    super('Não há cupons suficientes', HttpStatus.FAILED_DEPENDENCY);
  }
}
