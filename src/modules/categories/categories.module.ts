import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ProductsModule } from '../products/products.module';
import { Categories, CategorySchema } from 'src/entities/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categories.name, schema: CategorySchema },
    ]),
    forwardRef(() => ProductsModule), // Đảm bảo có forwardRef
  ],
  controllers: [CategoriesController], // Đăng ký controller
  providers: [CategoriesService], // Chưa có service
  exports: [MongooseModule], // Để module khác có thể sử dụng
})
export class CategoriesModule {}
