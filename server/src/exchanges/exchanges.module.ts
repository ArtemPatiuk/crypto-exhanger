import { Module } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { ExchangesController } from './exchanges.controller';
import { PrismaService } from '@prisma/prisma.service';
import { BinanceModule } from 'src/binance/binance.module';


@Module({
  imports:[BinanceModule],
  controllers: [ExchangesController],
  providers: [ExchangesService, PrismaService],
})
export class ExchangesModule {}
