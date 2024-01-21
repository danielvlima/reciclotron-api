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

  static isCPF(value: string) {
    let acc = 0;

    // Testa as sequencias que possuem todos os dígitos iguais e, se o cpf não tem 11 dígitos, retorna falso e exibe uma msg de erro
    if (
      value === '00000000000' ||
      value === '11111111111' ||
      value === '22222222222' ||
      value === '33333333333' ||
      value === '44444444444' ||
      value === '55555555555' ||
      value === '66666666666' ||
      value === '77777777777' ||
      value === '88888888888' ||
      value === '99999999999' ||
      value.length !== 11
    ) {
      return false;
    }

    // Os seis blocos seguintes de funções vão realizar a validação do CPF propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
    // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número para ser testado

    //Multiplica cada digito por numeros de 1 a 9, acc-os e multiplica-os por 10. Depois, divide o resultado encontrado por 11 para encontrar o rest
    for (let i = 1; i <= 9; i++) {
      acc = acc + parseInt(value.substring(i - 1, i)) * (11 - i);
    }

    let rest = (acc * 10) % 11;
    if (rest === 10 || rest === 11) {
      rest = 0;
    }

    if (rest !== parseInt(value.substring(9, 10))) {
      return false;
    }

    acc = 0;
    for (let k = 1; k <= 10; k++) {
      acc = acc + parseInt(value.substring(k - 1, k)) * (12 - k);
    }

    rest = (acc * 10) % 11;
    if (rest === 10 || rest === 11) {
      rest = 0;
    }

    if (rest !== parseInt(value.substring(10, 11))) {
      return false;
    }

    return true;
  }
}
