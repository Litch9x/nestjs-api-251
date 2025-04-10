import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [SearchController], // Nếu có controller thì thêm vào đây
  providers: [SearchService], // Nếu có service thì thêm vào đây
  exports: [], // Để module khác có thể sử dụng
})
export class SearchModule {}
