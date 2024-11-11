import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Customer } from 'src/customer/customer.model';
import { SaleProduct } from './sale-product.model';

export class Sale {
    @ApiProperty({
        description: 'Unique identifier for the sale',
        example: 'uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Unique identifier for the customer',
        example: 'uuid',
    })
    customerId: string;

    @ApiProperty({
        description: 'The date and time when the sale occurred',
        example: '2023-10-29T12:00:00Z',
    })
    saleDate: Date;

    @ApiProperty({
        description: 'Details of the customer associated with the sale',
    })
    customer: Customer;

    @ApiProperty({ type: SaleProduct, isArray: true })
    saleProducts: SaleProduct[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date | null;
}
