import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@ApiTags('Product')
@Controller('api/v1/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async getAllProducts(): Promise<Product[]> {
        return this.productService.getAllProducts();
    }

    @Get(':id')
    async getProduct(@Param('id') id: string): Promise<Product | null> {
        return this.productService.getProduct(id);
    }

    @Get('/search/:query')
    async searchProducts(@Param('query') query: string): Promise<Product[]> {
        return this.productService.searchProducts(query);
    }

    @Put(':id')
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully updated.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UpdateProductDTO,
        description: 'Json structure for product object',
    })
    async updateProduct(
        @Param('id') id: string,
        @Body() postData: UpdateProductDTO,
    ): Promise<Product> {
        return this.productService.updateProduct(id, postData);
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreateProductDTO,
        description: 'Json structure for product object',
    })
    async postProduct(@Body() postData: CreateProductDTO): Promise<Product> {
        return this.productService.createProduct(postData);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string): Promise<Product> {
        return this.productService.deleteProduct(id);
    }
}
