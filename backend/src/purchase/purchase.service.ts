import { PrismaService } from 'src/prisma.service';
import { Purchase } from './purchase.model';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePurchaseDTO } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
    constructor(private prisma: PrismaService) {}

    async getAllPurchases(): Promise<Purchase[]> {
        return this.prisma.purchase.findMany({
            where: {
                deletedAt: null,
            },
            include: {
                supplier: true,
                PurchaseSaleProducts: {
                    include: {
                        saleProduct: {
                            include: {
                                product: true,
                                sale: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async getPurchase(puchaseId: string): Promise<Purchase | null> {
        return this.prisma.purchase.findUnique({
            where: {
                id: puchaseId,
                deletedAt: null,
            },
            include: {
                supplier: true,
                PurchaseSaleProducts: {
                    include: {
                        saleProduct: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async searchPurchase(query: string): Promise<Purchase[]> {
        return this.prisma.purchase.findMany({
            where: {
                name: {
                    contains: query,
                },
                deletedAt: null,
            },
            include: {
                supplier: true,
                PurchaseSaleProducts: {
                    include: {
                        saleProduct: {
                            include: {
                                product: true,
                                sale: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async createPurchase(data: CreatePurchaseDTO): Promise<Purchase> {
        const purchaseSaleProducts =
            await this.prisma.purchaseSaleProduct.findMany({
                where: {
                    saleProductId: {
                        in: data.PurchaseSaleProducts.map(
                            (element) => element.saleProductId,
                        ),
                    },
                    purchase: {
                        deletedAt: null,
                    },
                },
                include: {
                    saleProduct: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

        if (purchaseSaleProducts.length > 0)
            throw new ConflictException(
                `O ${purchaseSaleProducts[0].saleProduct.product.name} da venda ${purchaseSaleProducts[0].saleProduct.saleId} já foi efetuada a compra.`,
            );

        return this.prisma.purchase.create({
            data: {
                ...data,
                PurchaseSaleProducts: {
                    createMany: {
                        data: data.PurchaseSaleProducts,
                    },
                },
            },
            include: {
                supplier: true,
                PurchaseSaleProducts: {
                    include: {
                        saleProduct: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
    }

    // TODO: updatePurchase

    async deletePurchase(purchaseId: string): Promise<Purchase> {
        return this.prisma.purchase.update({
            where: { id: purchaseId },
            include: {
                supplier: true,
                PurchaseSaleProducts: {
                    include: {
                        saleProduct: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            data: { deletedAt: new Date() },
        });
    }
}
