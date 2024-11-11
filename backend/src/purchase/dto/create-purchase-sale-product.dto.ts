import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseSaleProductDTO {
    @ApiProperty({
        description: 'Unique identifier for the sale product',
        example: 'uuid',
    })
    saleProductId: string;
}
