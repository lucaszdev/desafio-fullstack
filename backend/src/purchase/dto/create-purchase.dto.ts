import { ApiProperty } from '@nestjs/swagger';
import { CreatePurchaseSaleProductDTO } from './create-purchase-sale-product.dto';

export class CreatePurchaseDTO {
    @ApiProperty({
        description: 'name for the purchase',
        example: 'Purchase example',
    })
    name: string;

    @ApiProperty({
        description: 'description for the purchase',
        example: 'Purchase Description example',
    })
    description: string;

    @ApiProperty({
        description: 'Unique identifier for the supplier',
        example: 'uuid',
    })
    supplierId: string;

    @ApiProperty({ type: CreatePurchaseSaleProductDTO, isArray: true })
    PurchaseSaleProducts: CreatePurchaseSaleProductDTO[];
}
