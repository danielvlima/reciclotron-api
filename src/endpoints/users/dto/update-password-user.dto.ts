import { ApiProperty } from '@nestjs/swagger';

export class UpdatePassWordUserDto {
  @ApiProperty()
  cpf: string;

  @ApiProperty()
  senha: string;
}
