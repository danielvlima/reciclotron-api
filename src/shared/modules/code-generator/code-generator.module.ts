import { Module } from '@nestjs/common';

@Module({})
export class CodeGeneratorModule {
  static new = () => {
    const randVal = Math.random() * 999999;
    return Math.round(randVal).toString().padStart(6, '0');
  };
}
