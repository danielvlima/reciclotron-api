import { ApiProperty } from '@nestjs/swagger';

export class FilterOptionsCouponsDto {
  @ApiProperty({
    enum: ['', 'desativados', 'todosVendidos', 'ativosDisponiveis'],
  })
  filtro: '' | 'desativados' | 'todosVendidos' | 'ativosDisponiveis';

  @ApiProperty()
  busca: string;
}
