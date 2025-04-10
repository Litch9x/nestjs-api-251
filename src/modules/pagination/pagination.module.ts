import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from './pagination.service';
import { Products, ProductsSchema } from 'src/entities/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema }, // ✅ Thêm model Product vào đây
    ]),
  ],
  providers: [PaginationService], // Chưa có service
  exports: [PaginationService, MongooseModule], // Để module khác có thể sử dụng
})
export class PaginationModule {}
