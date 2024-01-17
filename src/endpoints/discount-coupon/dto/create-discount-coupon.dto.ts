import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountCouponDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  cnpjEmpresa: string;

  @ApiProperty()
  valor: number;

  @ApiProperty()
  quantidadeDisponiveis: number;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  regras: string;
}
