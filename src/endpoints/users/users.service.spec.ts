import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { TokenService } from 'src/shared/modules/auth/token.service';
import { JwtService } from '@nestjs/jwt';
import { GeneroUsuario, StatusTransacao, TipoTransacao } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let cpf;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, TokenService, JwtService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.usuarios.deleteMany({});
    await prisma.cuponsCompradosUsuario.deleteMany({});
    await prisma.transacoes.deleteMany({});

    cpf = "10572487037";

    await prisma.usuarios.create({
      data: {
        cpf: cpf,
        email: "fulano@email.com",
        telefone: "21999999999",
        nome: "Fulano de Beltrano",
        senha: "fulano123",
        dataAniversario: new Date(),
        generoUsuario: GeneroUsuario.HOMEM_CIS,
      },
    });

    const copoun = await prisma.cuponsDesconto.create({
      data: {
        nome: "Camisas",
        valor: 100,
        regras: "ser maior de idade",
        quantidadeDisponiveis: 2,
      },
    });
    
    await prisma.cuponsCompradosUsuario.create({
      data: {
        usuarioCPF: cpf,
        cupomId: copoun.id,
        cupomNome: copoun.nome,
        cupomRegras: copoun.regras,
        expiraEm: new Date(),
      },
    });

    await prisma.transacoes.createMany({
      data: [
        {
          titulo: "sexta-feira",
          usuarioCPF: cpf,
          tipo: TipoTransacao.DEBITO,
          valorTotal: 100,
          status: StatusTransacao.EFETIVADO,
        },
        {
          titulo: "quinta-feira",
          usuarioCPF: cpf,
          tipo: TipoTransacao.CREDITO,
          valorTotal: 100,
          status: StatusTransacao.PENDENTE,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.usuarios.deleteMany({});
    await prisma.cuponsCompradosUsuario.deleteMany({});
    await prisma.transacoes.deleteMany({});

    await prisma.$disconnect();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should create records', async () => {
    const user = await prisma.usuarios.findUnique({ where: { cpf } });
    const copoun = await prisma.cuponsCompradosUsuario.findMany({ where: { usuarioCPF: cpf } });
    const transactions = await prisma.transacoes.findMany({ where: { usuarioCPF: cpf } });

    expect(user).not.toBeNull;
    expect(copoun).toHaveLength(1);
    expect(transactions).toHaveLength(2);
  });

  it('should delete user', async () => {
    await service.remove(cpf);

    const user = await prisma.usuarios.findUnique({ where: { cpf } });

    expect(user).toBeNull();
  });

  it('should update copouns data', async () => {
    const copoun = await prisma.cuponsCompradosUsuario.findMany({});

    expect(copoun).toHaveLength(1);
    expect(copoun[0].usuarioCPF).toBeNull();
  });

  it('should update transactions data', async () => {
    const transactions = await prisma.transacoes.findMany({});

    expect(transactions).toHaveLength(2);
    expect(transactions[0].usuarioCPF).toBeNull();
    expect(transactions[1].usuarioCPF).toBeNull();
  });
});
