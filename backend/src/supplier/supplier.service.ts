import { PrismaService } from 'src/prisma.service';
import { Supplier } from './supplier.model';
import { Injectable } from '@nestjs/common';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';
import { CreateSupplierDTO } from './dto/create-supplier.dto';

@Injectable()
export class SupplierService {
    constructor(private prisma: PrismaService) {}

    async getAllSuppliers(): Promise<Supplier[]> {
        return this.prisma.supplier.findMany({
            where: {
                deletedAt: null,
            },
        });
    }

    async getSupplier(supplierId: string): Promise<Supplier | null> {
        return this.prisma.supplier.findUnique({
            where: {
                id: supplierId,
                deletedAt: null,
            },
        });
    }

    async searchSuppliers(query: string): Promise<Supplier[]> {
        return this.prisma.supplier.findMany({
            where: {
                name: {
                    contains: query,
                },
                deletedAt: null,
            },
        });
    }

    async createSupplier(data: CreateSupplierDTO): Promise<Supplier> {
        return this.prisma.supplier.create({
            data,
        });
    }

    async updateSupplier(
        id: string,
        data: UpdateSupplierDTO,
    ): Promise<Supplier> {
        return this.prisma.supplier.update({
            where: { id },
            data,
        });
    }

    async deleteSupplier(supplierId: string): Promise<Supplier> {
        return this.prisma.supplier.update({
            where: { id: supplierId },
            data: { deletedAt: new Date() },
        });
    }
}
