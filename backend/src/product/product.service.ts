import { PrismaService } from 'src/prisma.service';
import { Product } from './product.model';
import { Injectable } from '@nestjs/common';
import { UpdateProductDTO } from './dto/update-product.dto';
import { CreateProductDTO } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async getAllProducts(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }

    async getProduct(productId: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
    }

    async searchProducts(query: string): Promise<Product[]> {
        return this.prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                },
                deletedAt: null,
            },
        });
    }

    async createProduct(data: CreateProductDTO): Promise<Product> {
        return this.prisma.product.create({
            data,
        });
    }

    async updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async deleteProduct(productId: string): Promise<Product> {
        return this.prisma.product.delete({
            where: { id: productId },
        });
    }
}
