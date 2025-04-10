import { Module } from '@nestjs/common';
import { AdminCategoriesController } from './admin-categories.controller';
import { CategoriesModule } from 'src/modules/categories/categories.module';
import { AdminCategoriesService } from './admin-categories.service';

@Module({
  imports: [CategoriesModule],
  controllers: [AdminCategoriesController],
  providers: [AdminCategoriesService],
  exports: [AdminCategoriesService],
})
export class AdminCategoriesModule {}
