import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { GetPaginatedAddressesDTO } from './dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  count(/*data: GetPaginatedAddressesDTO*/) {
    return this.prisma.enderecos.count({});
  }

  findPaginated(data: GetPaginatedAddressesDTO) {
    return this.prisma.enderecos.findMany({
      where: {
        AND: [
          {
            rua: {
              contains: data.filterOptions.busca,
            },
          },
        ],
      },
      take: data.take,
      skip: data.skip,
    });
  }
}
