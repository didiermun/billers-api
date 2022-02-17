import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { create } from 'domain';
import { Public } from 'src/decorators/public-decorator.decorator';
import { createMeterDto } from './dto/createMeter.dto';
import { Meter } from './entities/meter.entity';
import { MeterService } from './meter.service';

@Controller('meter')
export class MeterController {
  constructor(private readonly meterService: MeterService) {}

  @Public()
  @Get('all')
  getAllMeters(): Promise<any> {
    return this.meterService.getAllMeters();
  }

  @Public()
  @Get('one/:meterNumber')
  getMeterByMeterNumber(
    @Param('meterNumber') meterNumber: number
  ): Promise<any> {
    return this.meterService.getMeterByMeterNumber(meterNumber);
  }

  @Public()
  @Post()
  create(@Body() createMeterDto: createMeterDto) {
    return this.meterService.registerMeter(createMeterDto);
  }

  @Public()
  @Post('/new')
  newMeter(@Body() meter: createMeterDto): Promise<any> {
    return this.meterService.registerMeter(meter);
  }
}
