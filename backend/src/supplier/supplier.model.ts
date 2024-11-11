import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class Supplier implements Prisma.SupplierCreateInput {
    @ApiProperty({
        description: 'Unique identifier for the customer',
        example: 'uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Name of the supplier',
        example: 'Supplier Inc.',
    })
    name: string;

    @ApiProperty({
        description: 'Email of the supplier',
        example: 'contact@supplier.com',
    })
    email: string;

    @ApiProperty({
        description: 'Phone number of the supplier',
        example: '+5511999999999',
    })
    phone: string;

    @ApiProperty({
        description: 'CNPJ of the supplier',
        example: '12.345.678/0001-99',
    })
    cnpj: string;

    @ApiProperty({
        description: 'Address of the supplier',
        example: '123 Supplier St, São Paulo, SP',
    })
    address: string;
}
