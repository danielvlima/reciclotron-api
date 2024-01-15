import { Injectable } from '@nestjs/common';
import {
  CreateEcopointDto,
  PaginatedEcopointDto,
  PaginatedEcopointsDepositDto,
  UpdateEcopointDto,
} from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { EcopointQuery } from './entities/ecopoint.query.entity';
import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';

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

  countEcopointsForDeposit(hasItemForBox: boolean, city?: string) {
    let typeFilter = {};
    if (hasItemForBox) {
      typeFilter = { tipo: { equals: $Enums.TipoEcoponto.BOX } };
    }
    return this.prisma.ecopontos
      .findMany({
        where: {
          AND: [
            { ativo: { equals: true } },
            {
              enderecos: {
                cidade: city,
              },
            },
            typeFilter,
          ],
        },
        include: {
          enderecos: true,
        },
      })
      .then((ecopoints) => {
        return ecopoints.length;
      });
  }

  findPaginatedEcopointsForDeposit(
    data: PaginatedEcopointsDepositDto,
  ): Promise<EcopointQuery[]> {
    if (data.hasItemForBox && data.city) {
      return this.prisma.$queryRaw`
              select 
                  e.id as ecoId, 
                  *, 
                  round(ST_Distance_Sphere(
                      point(b.lat, b.long),
                      point(${data.lat}, ${data.long})
                  )) as distancia   
              from Ecopontos e 
              left join Enderecos b
              ON e.enderecoId = b.id
              where ativo = true and cidade like ${data.city} and tipo like ${$Enums.TipoEcoponto.BOX} 
              order by distancia asc
              limit ${data.skip}, ${data.take};`;
    } else if (data.hasItemForBox && !data.city) {
      return this.prisma.$queryRaw`
                select 
                    e.id as ecoId, 
                    *, 
                    round(ST_Distance_Sphere(
                        point(b.lat, b.long),
                        point(${data.lat}, ${data.long})
                    )) as distancia   
                from Ecopontos e 
                left join Enderecos b
                ON e.enderecoId = b.id
                where ativo = true and tipo like ${$Enums.TipoEcoponto.BOX} 
                order by distancia asc
                limit ${data.skip}, ${data.take};`;
    } else if (data.city) {
      return this.prisma.$queryRaw`
                select 
                    e.id as ecoId, 
                    *, 
                    round(ST_Distance_Sphere(
                        point(b.lat, b.long),
                        point(${data.lat}, ${data.long})
                    )) as distancia  
                from Ecopontos e 
                left join Enderecos b
                ON e.enderecoId = b.id
                where ativo = true and cidade like ${data.city}
                order by distancia asc
                limit ${data.skip}, ${data.take};`;
    } else {
      return this.prisma.$queryRaw`
                select 
                    e.id as ecoId, 
                    *, 
                    round(ST_Distance_Sphere(
                        point(b.lat, b.long),
                        point(${data.lat}, ${data.long})
                    )) as distancia  
                from Ecopontos e 
                left join Enderecos b
                ON e.enderecoId = b.id
                where ativo = true
                order by distancia asc
                limit ${data.skip}, ${data.take};`;
    }
  }

  count(
    search: string,
    endId?: number,
    ativo?: boolean,
    tipo?: TypeEcopointEnum,
  ) {
    return this.prisma.ecopontos.count({
      where: {
        ativo: ativo,
        enderecoId: endId,
        tipo: tipo,
        OR: [{ id: { contains: search } }, { nome: { contains: search } }],
      },
    });
  }

  findPaginated(data: PaginatedEcopointDto) {
    return this.prisma.ecopontos.findMany({
      where: {
        ativo: data.ativo,
        tipo: data.tipo,
        enderecoId: data.enderecoId,
        OR: [
          { id: { contains: data.busca } },
          { nome: { contains: data.busca } },
        ],
      },
      include: {
        enderecos: true,
      },
      take: data.take,
      skip: data.skip,
    });
  }

  update(updateEcopointDto: UpdateEcopointDto) {
    return this.prisma.ecopontos.update({
      where: {
        id: updateEcopointDto.oldId,
      },

      data: {
        id: updateEcopointDto.id || undefined,
        ativo: updateEcopointDto.ativo,
        enderecoId: updateEcopointDto.enderecoId || undefined,
        tipo: updateEcopointDto.tipo,
        nome: updateEcopointDto.nome || undefined,
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
      include: {
        enderecos: true,
      },
    });
  }
}
