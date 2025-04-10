import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Products } from 'src/entities/product.schema';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService, // Thêm service Product vào đây
  ) {}

  @Get()
  async searchName(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
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
    return this.searchService.searchName(
      Number(page) || 1, // Mặc định page = 1 nếu không truyền
      Number(limit) || 10, // Mặc định limit = 10 nếu không truyền
      keyword,
    );
  }
}
