import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleProductDTO {
    @ApiProperty({
        description: 'Unique identifier for the product',
        example: 'uuid',
    })
    productId: string;

    @ApiProperty({
        description: 'The quantity of the product',
        example: 3,
    })
    quantity: number;
}
