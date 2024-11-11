import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class Product {
    id?: string;

    @ApiProperty({
        example: 'Headset Kraken 7. 1 V2',
        required: true,
    })
    name: string;

    @ApiProperty({
        example:
            'O Razer Kraken 7.1 V2 proporciona uma experiência de jogo com som surround que aumenta a sua noção de localização auditiva.',
        required: true,
    })
    description: string;

    @ApiProperty({
        example: 500,
        required: true,
    })
    price: number;

    @ApiProperty({
        example: 'Razer',
        required: true,
    })
    brand: string;
}
