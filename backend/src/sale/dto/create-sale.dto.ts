import { ApiProperty } from '@nestjs/swagger';
import { CreateSaleProductDTO } from './create-sale-product.dto';

export class CreateSaleDTO {
    @ApiProperty({
        description: 'name for the sale',
        example: 'Sale example',
    })
    name: string;

    @ApiProperty({
        description: 'description for the sale',
        example: 'Sale Description example',
    })
    description: string;

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

    @ApiProperty({ type: CreateSaleProductDTO, isArray: true })
    saleProducts: CreateSaleProductDTO[];
}
