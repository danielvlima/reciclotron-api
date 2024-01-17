import { Injectable } from '@nestjs/common';
import { CreateMaterialDto, UpdateMaterialDto } from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  create(createMaterialDto: CreateMaterialDto) {
    return this.prisma.materiais.create({
      data: createMaterialDto,
    });
  }

  findAll(ativo?: boolean) {
    let condition = {};
    if (ativo !== undefined) {
      condition = {
        where: { ativo },
      };
    }
    return this.prisma.materiais.findMany(condition);
  }

  update(updateMaterialDto: UpdateMaterialDto) {
    return this.prisma.materiais.update({
      where: {
        id: updateMaterialDto.id,
      },
      data: updateMaterialDto,
    });
  }

  remove(id: number) {
    return this.prisma.materiais.delete({
      where: { id },
    });
  }
}
