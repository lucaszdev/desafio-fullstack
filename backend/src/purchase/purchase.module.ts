import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PrismaService } from 'src/prisma.service';
import { PurchaseService } from './purchase.service';

@Module({
    controllers: [PurchaseController],
    providers: [PurchaseService, PrismaService],
})
export class PurchaseModule {}
