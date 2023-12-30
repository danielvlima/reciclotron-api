import { Controller, Post, Body, Patch, HttpCode } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  CreateDepositTransactionDto,
  CreatePurchaseTransactionDto,
  PaginatedTransaction,
  ResponsePaginatedTransactionsDto,
  ResponseTransactionDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { toTransactionDTO } from './mappers';
import { DiscountCouponService } from '../discount-coupon/discount-coupon.service';
import { CompareModule } from 'src/shared/modules/compare/compare.module';
import { UsersService } from '../users/users.service';
import { CouponsPurchasedService } from '../coupons-purchased/coupons-purchased.service';
import { $Enums } from '@prisma/client';
import { TransactionStatusEnum } from './enum/transactions-type.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transações')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly discountCouponService: DiscountCouponService,
    private readonly usersService: UsersService,
    private readonly couponsPurchasedService: CouponsPurchasedService,
  ) {}

  @Post('deposit')
  deposit(@Body() depositDto: CreateDepositTransactionDto) {
    return this.transactionsService.createDeposit(depositDto).then((value) => {
      return ResponseFactoryModule.generate<ResponseTransactionDto>(
        toTransactionDTO(value),
      );
    });
  }

  @Post('purchase')
  purchase(@Body() purchaseDto: CreatePurchaseTransactionDto) {
    return this.discountCouponService
      .findOne(purchaseDto.cupomId)
      .then((coupon) => {
        CompareModule.isGreaterThanOrEqual(
          coupon.quantidadeDisponiveis,
          purchaseDto.qtd,
        );
        return this.usersService
          .findOneWithCpf(purchaseDto.usuarioCPF)
          .then((user) => {
            CompareModule.isGreaterThanOrEqual(
              user.pontos,
              purchaseDto.valorTotal,
            );
            return this.transactionsService
              .createPurchase(purchaseDto)
              .then(async (newTransaction) => {
                await this.discountCouponService.update({
                  id: purchaseDto.cupomId,
                  quantidadeDisponiveis:
                    coupon.quantidadeDisponiveis - purchaseDto.qtd,
                });

                await this.usersService.update({
                  cpf: user.cpf,
                  pontos: user.pontos - purchaseDto.valorTotal,
                });

                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30); // TODO: Precisa decidir a quantidade de dias de expiração
                for (let i = 0; i < purchaseDto.qtd; i++) {
                  await this.couponsPurchasedService.create({
                    usuarioCPF: purchaseDto.usuarioCPF,
                    cupomId: purchaseDto.cupomId,
                    expiraEm: expirationDate,
                    criadoEm: new Date(),
                  });
                }

                return ResponseFactoryModule.generate<ResponseTransactionDto>(
                  toTransactionDTO(newTransaction),
                );
              });
          });
      });
  }

  @Post()
  findAll(@Body() data: PaginatedTransaction) {
    return this.transactionsService.count(data).then((total) => {
      return this.transactionsService.findAll(data).then((transactions) => {
        return ResponseFactoryModule.generate<ResponsePaginatedTransactionsDto>(
          {
            total,
            transacoes: transactions.map((el) => toTransactionDTO(el)),
          },
        );
      });
    });
  }

  @HttpCode(204)
  @Patch()
  update(@Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService
      .findOne(updateTransactionDto.id)
      .then((transaction) => {
        return this.usersService
          .findOneWithCpf(transaction.usuarioCPF)
          .then(async (user) => {
            if (
              transaction.tipo === $Enums.TipoTransacao.CREDITO &&
              updateTransactionDto.status === TransactionStatusEnum.EFETIVADO
            ) {
              await this.usersService.update({
                cpf: transaction.usuarioCPF,
                pontos: user.pontos + transaction.valorTotal,
              });
            }
            return this.transactionsService.update(updateTransactionDto);
          });
      });
  }
}
