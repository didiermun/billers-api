import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterModule } from '../meter/meter.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/Transaction-.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), MeterModule],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
