import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class Customer {
    id?: string;

    @ApiProperty({
        example: 'Ellie Williams',
        required: true,
    })
    name: string;

    @ApiProperty({
        example: '391.945.720-03',
        required: true,
    })
    cpfOrCnpj: string;

    @ApiProperty({
        example: 'ellie.williams@gmail.com',
        required: true,
    })
    email: string;

    @ApiProperty({
        example: '(84) 9 9110-6666',
        required: true,
    })
    phone: string;
}
