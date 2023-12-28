import { Global, Module } from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Global()
@Module({})
export class ResponseFactoryModule {
  static generate = <T>(value: T): ResponseDto<T> => {
    return { body: value };
  };

  static generateError = <T>(value: T) => {
    return { error: value };
  };
}
