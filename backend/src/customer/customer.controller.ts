import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { Customer } from './customer.model';
import { CustomerService } from './customer.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';

@ApiTags('Customer')
@Controller('api/v1/customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get()
    async getAllProducts(): Promise<Customer[]> {
        return this.customerService.getAllCustomers();
    }

    @Get(':id')
    async getProduct(@Param('id') id: string): Promise<Customer | null> {
        return this.customerService.getCustomer(id);
    }

    @Get('/search/:query')
    async searchCustomers(@Param('query') query: string): Promise<Customer[]> {
        return this.customerService.searchCustomers(query);
    }

    @Put(':id')
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully updated.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UpdateCustomerDTO,
        description: 'Json structure for customer object',
    })
    async updateCustomer(
        @Param('id') id: string,
        @Body() postData: UpdateCustomerDTO,
    ): Promise<Customer> {
        return this.customerService.updateCustomer(id, postData);
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreateCustomerDTO,
        description: 'Json structure for customer object',
    })
    async postProduct(@Body() postData: CreateCustomerDTO): Promise<Customer> {
        return this.customerService.createCustomer(postData);
    }

    @Delete(':id')
    async deleteCustomer(@Param('id') id: string): Promise<Customer> {
        return this.customerService.deleteCustomer(id);
    }
}
