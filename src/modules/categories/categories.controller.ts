import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ProductsService } from '../products/products.service';
import { Categories } from 'src/entities/category.schema';
import { Products } from 'src/entities/product.schema';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productService: ProductsService, // Thêm service Product vào đây
  ) {}
  @Get()
  async findAll(): Promise<{ data: Categories[] }> {
    const categories = await this.categoriesService.findAll();
    return {
      data: categories,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<{ category: Categories }> {
    const category = await this.categoriesService.findById(id);
    return {
      category,
    };
  }

  @Get(':id/products')
  async getProductByCategoryId(
    @Param('id') category_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<{
    data: Products[];
    pages: {
      total: number;
      currentPage: number;
      hasNext: boolean;
      hasPrev: boolean;
      next: number;
      prev: number;
    };
  }> {
    return await this.categoriesService.getProductByCategory(
      Number(page) || 1, // Mặc định page = 1 nếu không truyền
      Number(limit) || 10, // Mặc định limit = 10 nếu không truyền
      search,
      category_id,
    );
  }
}
