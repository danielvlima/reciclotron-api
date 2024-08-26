import { Test, TestingModule } from '@nestjs/testing';
import { PartnerService } from './partner.service';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { TokenService } from 'src/shared/modules/auth/token.service';
import { JwtService } from '@nestjs/jwt';
import { TipoEmpresa } from '@prisma/client';

describe('PartnerService', () => {
  let service: PartnerService;
  let prisma: PrismaService;
  let cnpj;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerService, PrismaService, TokenService, JwtService],
    }).compile();

    service = module.get<PartnerService>(PartnerService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.empresasParceiras.deleteMany({});
    await prisma.cuponsDesconto.deleteMany({});

    cnpj = "03186133000192";

    await prisma.empresasParceiras.create({
      data: {
        cnpj: cnpj,
        email: "fulene@email.com",
        telefone: "21123456789",
        nomeFantasia: "Fulene Camisas",
        razaoSocial: "Fulene LTDA",
        senha: "fulene123",
        ramo: "Vestuário",
        tipoEmpresa: TipoEmpresa.FISICA,
      },
    });

    await prisma.cuponsDesconto.createMany({
      data: [
        {
          cnpjEmpresa: cnpj,
          nome: "Camisas Verdes",
          valor: 100,
          regras: "ser menor de idade",
          quantidadeDisponiveis: 2,
        },
        {
          cnpjEmpresa: cnpj,
          nome: "Camisas Roxas",
          valor: 50,
          regras: "ser maior de idade",
          quantidadeDisponiveis: 3,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.empresasParceiras.deleteMany({});
    await prisma.cuponsDesconto.deleteMany({});

    await prisma.$disconnect();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should delete partner', async () => {
    await service.remove(cnpj);

    const partner = await prisma.empresasParceiras.findUnique({ where: { cnpj } });

    expect(partner).toBeNull();
  });

  it('should update copouns data', async () => {
    const copouns = await prisma.cuponsDesconto.findMany({});

    expect(copouns).toHaveLength(2);
    expect(copouns[0].cnpjEmpresa).toBeNull();
    expect(copouns[1].cnpjEmpresa).toBeNull();
  });
});
