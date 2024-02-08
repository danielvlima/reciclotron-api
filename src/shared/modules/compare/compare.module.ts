import { Module } from '@nestjs/common';

@Module({})
export class CompareModule {
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

    //Multiplica cada digito por numbers de 1 a 9, acc-os e multiplica-os por 10. Depois, divide o result encontrado por 11 para encontrar o rest
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

  static isCNPJ(value: string) {
    // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
    if (
      value === '00000000000000' ||
      value === '11111111111111' ||
      value === '22222222222222' ||
      value === '33333333333333' ||
      value === '44444444444444' ||
      value === '55555555555555' ||
      value === '66666666666666' ||
      value === '77777777777777' ||
      value === '88888888888888' ||
      value === '99999999999999' ||
      value.length !== 14
    ) {
      return false;
    }

    // A variável numbers pega o bloco com os números sem o DV, a variavel digits pega apenas os dois ultimos numbers (Digito Verificador).
    let len = value.length - 2;
    let numbers = value.substring(0, len);
    const digits = value.substring(len);
    let sum = 0;
    let pos = len - 7;

    // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
    // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número
    for (let i = len; i >= 1; i--) {
      sum += Number(numbers.charAt(len - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != Number(digits.charAt(0))) {
      return false;
    }

    len = len + 1;
    numbers = value.substring(0, len);
    sum = 0;
    pos = len - 7;
    for (let k = len; k >= 1; k--) {
      sum += Number(numbers.charAt(len - k)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != Number(digits.charAt(1))) {
      return false;
    }

    return true;
  }
}
