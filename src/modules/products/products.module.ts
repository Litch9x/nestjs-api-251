import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesModule } from '../categories/categories.module';
import { CommentsModule } from '../comments/comments.module';
import { Products, ProductsSchema } from 'src/entities/product.schema';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
    ]),
    forwardRef(() => CategoriesModule), // Dùng forwardRef nếu có circular dependency // Import CategoriesModule để dùng populate()
    forwardRef(() => CommentsModule), // Đảm bảo có forwardRef
    PaginationModule,
    // CommentsService,
  ],
  controllers: [ProductsController], // Nếu có controller thì thêm vào đây
  providers: [ProductsService, PaginationService], // Nếu có service thì thêm vào đây
  exports: [MongooseModule, ProductsService], // Để module khác có thể sử dụng
})
export class ProductsModule {}
