import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public-decorator.decorator';
import { createTransactionDto } from './dto/createTransactionDto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly TransactionService: TransactionService) {}

  @Public()
  @Get('/')
  public async getAllMeters(): Promise<any> {
    return await this.TransactionService.getAllTransactions();
  }

  @Public()
  @Get('one/:meterNumber')
  public async getMeterByMeterNumber(
    @Param('meterNumber') meterNumber: number
  ): Promise<any> {
    return await this.TransactionService.getTransactionByMeterNumber(
      meterNumber
    );
  }

  @Public()
  @Post('/')
  async newTransaction(
    @Body() transaction: createTransactionDto
  ): Promise<any> {
    return await this.TransactionService.makeTransaction(transaction);
  }
}
