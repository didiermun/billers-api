import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ETokenStatus } from 'src/shared/enums/ETokenStatus';
import { Repository } from 'typeorm';
import { MeterService } from '../meter/meter.service';
import { createTransactionDto } from './dto/createTransactionDto';
import { Transaction } from './entities/Transaction-.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly TransactionRepository: Repository<Transaction>,
    private readonly meterService: MeterService
  ) {}

  getAllTransactions(): Promise<any> {
    try {
      const meters = this.TransactionRepository.find();
      return meters;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getTransactionByMeterNumber(meterNumber: number): Promise<any> {
    try {
      const meters = this.TransactionRepository.findOne({
        where: { meterNumber: meterNumber }
      });
      return meters;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async makeTransaction(transactionDto: createTransactionDto): Promise<any> {
    try {
      const meterExists = await this.meterService.getMeterByMeterNumber(
        transactionDto.meterNumber
      );

      if (!meterExists) {
        throw new HttpException('meter not found', HttpStatus.NOT_ACCEPTABLE);
      }

      const amount = transactionDto.amount;
      if (amount < 100) {
        throw new NotAcceptableException(
          'can not buy Transaction with a < 100 balance'
        );
      }
      const lightingdays = amount / 100;
      if (lightingdays > 365 * 5) {
        throw new NotAcceptableException(' can not exceed 5 years');
      }

      const meterNumber = transactionDto.meterNumber;
      const token = amount * lightingdays;

      const tokenStatus = ETokenStatus.DEACTIVATED;
      const transaction: Transaction = this.TransactionRepository.create({
        amount,
        meterNumber,
        token,
        tokenStatus
      });
      return this.TransactionRepository.save(transaction);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  randomFixedMeterNumber(length: number) {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  }
}
