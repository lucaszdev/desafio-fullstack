import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/customer/customer.model';
import { Product } from 'src/product/product.model';

export class SaleProduct {
    @ApiProperty()
    id: string;

    @ApiProperty()
    saleId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty({ type: Product })
    product: Product;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date | null;
}
