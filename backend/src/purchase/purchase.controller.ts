import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Purchase } from './purchase.model';
import { PurchaseService } from './purchase.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePurchaseDTO } from './dto/create-purchase.dto';

@ApiTags('Purchase')
@Controller('api/v1/purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Get()
    async getAllPurchases(): Promise<Purchase[]> {
        return this.purchaseService.getAllPurchases();
    }

    @Get(':id')
    async getPurchase(@Param('id') id: string): Promise<Purchase | null> {
        return this.purchaseService.getPurchase(id);
    }

    @Get('/search/:query')
    async searchPurchases(@Param('query') query: string): Promise<Purchase[]> {
        return this.purchaseService.searchPurchase(query);
    }

    // TODO updatePurchase

    @Post()
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreatePurchaseDTO,
        description: 'Json structure for purchase object',
    })
    async postPurchase(@Body() postData: CreatePurchaseDTO): Promise<Purchase> {
        return this.purchaseService.createPurchase(postData);
    }

    @Delete(':id')
    async deleteSale(@Param('id') id: string): Promise<Purchase> {
        return this.purchaseService.deletePurchase(id);
    }
}
