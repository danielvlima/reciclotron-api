import { Injectable } from '@nestjs/common';
import { CreateEcopointDto, UpdateEcopointDto } from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Injectable()
export class EcopointsService {
  constructor(private prisma: PrismaService) {}

  create(createEcopointDto: CreateEcopointDto) {
    return this.prisma.ecopontos.create({
      data: createEcopointDto,
      include: {
        enderecos: true,
      },
    });
  }

  findAll() {
    return `This action returns all ecopoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ecopoint`;
  }

  update(updateEcopointDto: UpdateEcopointDto) {
    return this.prisma.ecopontos.update({
      where: {
        id: updateEcopointDto.id,
      },

      data: {
        id: updateEcopointDto.id || undefined,
        ativo: updateEcopointDto.ativo || undefined,
        enderecoId: updateEcopointDto.enderecoId || undefined,
        tipo: updateEcopointDto.tipo || undefined,
        atualizadoEm: new Date(),
      },
      include: {
        enderecos: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.ecopontos.delete({
      where: {
        id,
      },
    });
  }
}
