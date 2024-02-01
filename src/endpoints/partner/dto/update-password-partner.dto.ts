import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordPartnerDto {
  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  senha: string;
}
