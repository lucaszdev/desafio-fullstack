import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDTO {
    @ApiProperty({ description: 'Name of the customer', example: 'John Doe' })
    name: string;

    @ApiProperty({
        description: 'CPF or CNPJ of the customer',
        example: '12345678901',
    })
    cpfOrCnpj: string;

    @ApiProperty({
        description: 'Email address of the customer',
        example: 'johndoe@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Phone number of the customer',
        example: '+5511999999999',
    })
    phone: string;
}
