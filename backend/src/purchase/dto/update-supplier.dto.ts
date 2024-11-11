import { ApiProperty } from '@nestjs/swagger';

export class UpdateSaleDTO {
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
}
