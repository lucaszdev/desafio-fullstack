import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { PrismaService } from 'src/prisma.service';
import { SaleService } from './sale.service';

@Module({
    controllers: [SaleController],
    providers: [SaleService, PrismaService],
})
export class SaleModule {}
