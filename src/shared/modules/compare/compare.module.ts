import { Module } from '@nestjs/common';

@Module({})
export class CompareModule {
  static isGreaterThanOrEqual(a: number, b: number) {
    if (!(a >= b)) {
      throw Error('A nao eh maior ou igual que B');
    }
  }

  static notIsEqual<T>(a: T, b: T) {
    if (a === b) {
      throw Error('A eh igual a B');
    }
  }
}
