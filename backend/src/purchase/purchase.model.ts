import { Supplier } from 'src/supplier/supplier.model';
import { PurchaseSaleProduct } from './purchase-sale-product.model';
import { ApiProperty } from '@nestjs/swagger';

export class Purchase {
    @ApiProperty({
        description: 'Unique identifier for the purchase',
        example: 'uuid',
    })
    id: string;

    @ApiProperty({ type: Supplier })
    supplier: Supplier;

    @ApiProperty({
        description: 'Unique identifier for the supplier',
        example: 'uuid',
    })
    supplierId: string;

    @ApiProperty({ type: PurchaseSaleProduct, isArray: true })
    PurchaseSaleProducts: PurchaseSaleProduct[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt?: Date | null;
}
