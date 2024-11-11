import { PrismaService } from 'src/prisma.service';
import { Customer } from './customer.model';
import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { CreateCustomerDTO } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
    constructor(private prisma: PrismaService) {}

    async getAllCustomers(): Promise<Customer[]> {
        return this.prisma.customer.findMany({
            where: {
                deletedAt: null,
            },
        });
    }

    async getCustomer(customerId: string): Promise<Customer | null> {
        return this.prisma.customer.findUnique({
            where: {
                id: customerId,
                deletedAt: null,
            },
        });
    }

    async searchCustomers(query: string): Promise<Customer[]> {
        return this.prisma.customer.findMany({
            where: {
                name: {
                    contains: query,
                },
                deletedAt: null,
            },
        });
    }

    async createCustomer(data: CreateCustomerDTO): Promise<Customer> {
        const customerByCpfCnpj = await this.prisma.customer.findUnique({
            where: { cpfOrCnpj: data.cpfOrCnpj },
        });

        if (customerByCpfCnpj)
            throw new ConflictException(
                'Already have one customer with this Cpf/Cnpj',
            );

        const customerByEmail = await this.prisma.customer.findUnique({
            where: { email: data.email },
        });

        if (customerByEmail)
            throw new ConflictException(
                'Already have one customer with this email',
            );

        return this.prisma.customer.create({
            data,
        });
    }

    async updateCustomer(
        id: string,
        data: UpdateCustomerDTO,
    ): Promise<Customer> {
        return this.prisma.customer.update({
            where: { id },
            data,
        });
    }

    async deleteCustomer(customerId: string): Promise<Customer> {
        return this.prisma.customer.update({
            where: { id: customerId },
            data: { deletedAt: new Date() },
        });
    }
}
