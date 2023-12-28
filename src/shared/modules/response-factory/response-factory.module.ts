import { Module } from '@nestjs/common';

@Module({})
export class ResponseFactoryModule {
  static generate = <T>(value: T) => {
    return { body: value };
  };

  static generateError = <T>(value: T) => {
    return { error: value };
  };
}
