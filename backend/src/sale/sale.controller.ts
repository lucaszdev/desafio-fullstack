import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Sale } from './sale.model';
import { SaleService } from './sale.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { UpdateSaleDTO } from './dto/update-supplier.dto';

@ApiTags('Sale')
@Controller('api/v1/sale')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @Get()
    async getAllSales(): Promise<Sale[]> {
        return this.saleService.getAllSales();
    }

    @Get(':id')
    async getSale(@Param('id') id: string): Promise<Sale | null> {
        return this.saleService.getSale(id);
    }

    @Get('/search/:query')
    async searchSales(@Param('query') query: string): Promise<Sale[]> {
        return this.saleService.searchSale(query);
    }

    @Put(':id')
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully updated.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UpdateSaleDTO,
        description: 'Json structure for sale object',
    })
    async updateSupplier(
        @Param('id') id: string,
        @Body() postData: UpdateSaleDTO,
    ): Promise<Sale> {
        return this.saleService.updateSale(id, postData);
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreateSaleDTO,
        description: 'Json structure for sale object',
    })
    async postSale(@Body() postData: CreateSaleDTO): Promise<Sale> {
        return this.saleService.createSale(postData);
    }

    @Delete(':id')
    async deleteSale(@Param('id') id: string): Promise<Sale> {
        return this.saleService.deleteSale(id);
    }
}
