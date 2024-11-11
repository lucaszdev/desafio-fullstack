import { PrismaService } from 'src/prisma.service';
import { Sale } from './sale.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSaleDTO } from './dto/update-supplier.dto';
import { CreateSaleDTO } from './dto/create-sale.dto';

@Injectable()
export class SaleService {
    constructor(private prisma: PrismaService) {}

    async getAllSales(): Promise<Sale[]> {
        return this.prisma.sale.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                customer: true,
                saleProducts: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async getSale(saleId: string): Promise<Sale | null> {
        return this.prisma.sale.findUnique({
            where: {
                id: saleId,
                deletedAt: null,
            },
            include: {
                customer: true,
                saleProducts: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async searchSale(query: string): Promise<Sale[]> {
        return this.prisma.sale.findMany({
            where: {
                name: {
                    contains: query,
                },
                deletedAt: null,
            },
            include: {
                customer: true,
                saleProducts: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async createSale(data: CreateSaleDTO): Promise<Sale> {
        return this.prisma.sale.create({
            data: {
                ...data,
                saleProducts: {
                    createMany: {
                        data: data.saleProducts,
                    },
                },
            },
            include: {
                customer: true,
                saleProducts: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async updateSale(id: string, data: UpdateSaleDTO): Promise<Sale> {
        const verifyIfSaleExist = await this.prisma.sale.findFirst({
            where: { id },
        });

        if (!verifyIfSaleExist) throw new NotFoundException('Sale Not Found!');

        return this.prisma.sale.update({
            where: { id },
            data: {
                customerId: data.customerId,
                saleDate: data.saleDate,
            },
            include: {
                customer: true,
                saleProducts: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async deleteSale(saleId: string): Promise<Sale> {
        return this.prisma.sale.update({
            where: { id: saleId },
            include: {
                customer: true,
                saleProducts: {
                    include: {
                        product: true,
                    },
                },
            },
            data: { deletedAt: new Date() },
        });
    }
}
