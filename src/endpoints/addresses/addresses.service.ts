import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { GetPaginatedAddressesDTO } from './dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  count(data: GetPaginatedAddressesDTO) {
    return this.prisma.enderecos
      .findMany({
        where: {
          AND: [
            {
              OR: [
                { bairro: { contains: data.filterOptions.busca } },
                { rua: { contains: data.filterOptions.busca } },
                { cidade: { contains: data.filterOptions.busca } },
                { uf: { contains: data.filterOptions.busca } },
                { cep: { contains: data.filterOptions.busca } },
                { complemento: { contains: data.filterOptions.busca } },
                { numero: { contains: data.filterOptions.busca } },
              ],
            },
            {
              empresa: { ativo: true },
            },
          ],
        },
        include: {
          empresa: true,
        },
      })
      .then((value) => value.length);
  }

  findPaginated(data: GetPaginatedAddressesDTO) {
    return this.prisma.enderecos.findMany({
      where: {
        AND: [
          {
            OR: [
              { bairro: { contains: data.filterOptions.busca } },
              { rua: { contains: data.filterOptions.busca } },
              { cidade: { contains: data.filterOptions.busca } },
              { uf: { contains: data.filterOptions.busca } },
              { cep: { contains: data.filterOptions.busca } },
              { complemento: { contains: data.filterOptions.busca } },
              { numero: { contains: data.filterOptions.busca } },
            ],
          },
          {
            empresa: { ativo: true },
          },
        ],
      },
      include: {
        empresa: true,
      },
      take: data.take,
      skip: data.skip,
    });
  }
}
