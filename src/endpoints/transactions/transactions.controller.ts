import {
  Controller,
  Post,
  Body,
  Patch,
  HttpCode,
  Get,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  CreateDepositTransactionDto,
  CreatePurchaseTransactionDto,
  PaginatedTransaction,
  PaginatedUnconfirmedTransaction,
  ResponsePaginatedTransactionsDto,
  ResponseTransactionDto,
  ResponseUnconfirmedDepositTransactionDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { toTransactionDTO, toUnconfirmedTransactionDTO } from './mappers';
import { DiscountCouponService } from '../discount-coupon/discount-coupon.service';
import { UsersService } from '../users/users.service';
import { CouponsPurchasedService } from '../coupons-purchased/coupons-purchased.service';
import { $Enums } from '@prisma/client';
import { TransactionStatusEnum } from './enum/transactions-type.enum';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentKey, Public } from 'src/shared/decorators';
import { AdminGuard, UserGuard } from 'src/shared/guards';
import { EcopointsService } from '../ecopoints/ecopoints.service';
import {
  EffectedTransactionException,
  InsufficientBalanceException,
  NoCouponsAvailableException,
  NotActiveEcopointException,
  NotCreditTransactionException,
  StatusNotEffectedUpdateTransactionException,
} from 'src/exceptions';
import { MailService } from 'src/shared/modules/mail/mail.service';

@ApiTags('Transações')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly discountCouponService: DiscountCouponService,
    private readonly usersService: UsersService,
    private readonly ecopointService: EcopointsService,
    private readonly couponsPurchasedService: CouponsPurchasedService,
    private mailerService: MailService,
  ) {}

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('user/deposit')
  async deposit(
    @GetCurrentKey() cpf: string,
    @Body() depositDto: CreateDepositTransactionDto,
  ) {
    const user = await this.usersService.findOneWithCpf(cpf);
    const ecopoint = await this.ecopointService.findOne(depositDto.ecopontoId);

    if (!ecopoint.ativo) {
      throw new NotActiveEcopointException();
    }
    await this.transactionsService.createDeposit(
      cpf,
      'Reciclopontos: Novo Depósito',
      depositDto,
    );

    await this.mailerService.sendUserNewDeposit(
      user.email,
      user.nome,
      depositDto.valorTotal.toFixed(),
      depositDto.materiaisDepositados,
      ecopoint,
    );

    return;
  }

  @UseGuards(UserGuard)
  @Public()
  @Post('user/purchase')
  async purchase(
    @GetCurrentKey() cpf: string,
    @Body() purchaseDto: CreatePurchaseTransactionDto,
  ) {
    const coupon = await this.discountCouponService.findOne(
      purchaseDto.cupomId,
    );

    if (!(coupon.quantidadeDisponiveis >= purchaseDto.qtd)) {
      throw new NoCouponsAvailableException();
    }

    const user = await this.usersService.findOneWithCpf(cpf);

    if (!(user.pontos >= purchaseDto.valorTotal)) {
      throw new InsufficientBalanceException();
    }

    const newTransaction = await this.transactionsService.createPurchase(
      cpf,
      `Resgate Prêmio: ${coupon.nome}`,
      purchaseDto,
    );

    await this.discountCouponService.update(coupon.cnpjEmpresa, {
      id: purchaseDto.cupomId,
      quantidadeDisponiveis: coupon.quantidadeDisponiveis - purchaseDto.qtd,
    });

    await this.usersService.update({
      cpf: cpf,
      pontos: user.pontos - purchaseDto.valorTotal,
    });

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30); // TODO: Precisa decidir a quantidade de dias de expiração
    for (let i = 0; i < purchaseDto.qtd; i++) {
      await this.couponsPurchasedService.create({
        usuarioCPF: cpf,
        cupomId: purchaseDto.cupomId,
        cupomNome: coupon.nome,
        cupomRegras: coupon.regras,
        expiraEm: expirationDate,
        criadoEm: new Date(),
      });
    }

    await this.mailerService.sendUserNewPurchase(
      user.email,
      user.nome,
      coupon.nome,
    );
    return ResponseFactoryModule.generate<ResponseTransactionDto>(
      toTransactionDTO(newTransaction),
    );
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('user/get')
  async findAll(
    @GetCurrentKey() cpf: string,
    @Body() data: PaginatedTransaction,
  ) {
    const total = await this.transactionsService.count(cpf, data);
    if (!total) {
      return ResponseFactoryModule.generate<
        ResponsePaginatedTransactionsDto<ResponseTransactionDto>
      >({
        total,
        transacoes: [],
      });
    }
    const transactions = await this.transactionsService.findAll(cpf, data);
    return ResponseFactoryModule.generate<
      ResponsePaginatedTransactionsDto<ResponseTransactionDto>
    >({
      total,
      transacoes: transactions.map((el) => toTransactionDTO(el)),
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin/deposit/unconfirmed/get')
  findAllUnconfirmed(@Body() data: PaginatedUnconfirmedTransaction) {
    return this.transactionsService
      .countUnconfirmed(data.ecopontoId)
      .then((total) => {
        return this.transactionsService
          .findAllUnconfirmed(data)
          .then((transactions) => {
            return ResponseFactoryModule.generate<
              ResponsePaginatedTransactionsDto<ResponseUnconfirmedDepositTransactionDto>
            >({
              total,
              transacoes: transactions.map((el) =>
                toUnconfirmedTransactionDTO(el),
              ),
            });
          });
      });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('admin/deposit/unconfirmed/filter/ecopoints')
  findAllUnconfirmedEcopoints() {
    return this.transactionsService
      .findAllUnconfirmedEcopoints()
      .then((value) => {
        return ResponseFactoryModule.generate<string[]>(
          value.map((el) => el.ecopontoId),
        );
      });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('admin/deposit/confirm')
  async update(@Body() updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionsService.findOne(
      updateTransactionDto.id,
    );

    const valueTransaction =
      updateTransactionDto.valorTotal ?? transaction.valorTotal;

    if (transaction.status === $Enums.StatusTransacao.EFETIVADO) {
      throw new EffectedTransactionException();
    }

    if (updateTransactionDto.status !== TransactionStatusEnum.EFETIVADO) {
      throw new StatusNotEffectedUpdateTransactionException();
    }

    if (transaction.tipo !== $Enums.TipoTransacao.CREDITO) {
      throw new NotCreditTransactionException();
    }

    const user = await this.usersService.findOneWithCpf(transaction.usuarioCPF);

    await this.usersService.update({
      cpf: transaction.usuarioCPF,
      pontos: user.pontos + valueTransaction,
    });

    const dayCreated = new Date(transaction.criadoEm);

    await this.transactionsService.update(updateTransactionDto);
    this.mailerService.sendUserDepositConfirmed(
      user.email,
      user.nome,
      `${dayCreated.getDate().toString().padStart(2, '0')}/${(
        dayCreated.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${dayCreated.getFullYear()}`,
      valueTransaction.toFixed(),
    );
    return;
  }
}
