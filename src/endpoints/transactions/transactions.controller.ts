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

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

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
    return this.transactionsService
      .createPurchase(purchaseDto)
      .then((value) => {
        return ResponseFactoryModule.generate<ResponseTransactionDto>(
          toTransactionDTO(value),
        );
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
    return this.transactionsService.update(updateTransactionDto);
  }
}
