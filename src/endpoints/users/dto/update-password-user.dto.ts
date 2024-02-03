import { ApiProperty } from '@nestjs/swagger';

export class UpdatePassWordUserDto {
  @ApiProperty()
  senha: string;
}
