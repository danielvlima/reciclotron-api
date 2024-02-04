import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordPartnerDto {
  @ApiProperty()
  senha: string;
}
