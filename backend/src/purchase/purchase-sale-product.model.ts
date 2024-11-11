import { ApiProperty } from '@nestjs/swagger';
import { SaleProduct } from 'src/sale/sale-product.model';
import { Purchase } from './purchase.model';

export class PurchaseSaleProduct {
    @ApiProperty({
        description: 'Unique identifier for the purchase',
        example: 'uuid',
    })
    id: string;

    @ApiProperty({ type: SaleProduct })
    saleProduct: SaleProduct;

    @ApiProperty({
        description: 'Unique identifier for the sale product',
        example: 'uuid',
    })
    saleProductId: string;

    @ApiProperty({
        description: 'Unique identifier for the puchase',
        example: 'uuid',
    })
    purchaseId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt?: Date | null;
}
