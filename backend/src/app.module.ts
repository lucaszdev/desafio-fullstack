import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/custumer.module';
import { SupplierModule } from './supplier/supplier.module';
import { SaleModule } from './sale/sale.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
    imports: [
        ProductModule,
        CustomerModule,
        SupplierModule,
        SaleModule,
        PurchaseModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
