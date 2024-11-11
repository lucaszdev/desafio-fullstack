import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Supplier } from './supplier.model';
import { SupplierService } from './supplier.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';

@ApiTags('Supplier')
@Controller('api/v1/supplier')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) {}

    @Get()
    async getAllSuppliers(): Promise<Supplier[]> {
        return this.supplierService.getAllSuppliers();
    }

    @Get(':id')
    async getSupplier(@Param('id') id: string): Promise<Supplier | null> {
        return this.supplierService.getSupplier(id);
    }

    @Get('/search/:query')
    async searchSuppliers(@Param('query') query: string): Promise<Supplier[]> {
        return this.supplierService.searchSuppliers(query);
    }

    @Put(':id')
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully updated.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UpdateSupplierDTO,
        description: 'Json structure for supplier object',
    })
    async updateSupplier(
        @Param('id') id: string,
        @Body() postData: UpdateSupplierDTO,
    ): Promise<Supplier> {
        return this.supplierService.updateSupplier(id, postData);
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreateSupplierDTO,
        description: 'Json structure for supplier object',
    })
    async postSupplier(@Body() postData: CreateSupplierDTO): Promise<Supplier> {
        return this.supplierService.createSupplier(postData);
    }

    @Delete(':id')
    async deleteSupplier(@Param('id') id: string): Promise<Supplier> {
        return this.supplierService.deleteSupplier(id);
    }
}
