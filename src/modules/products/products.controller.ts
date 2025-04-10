import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CommentsService } from '../comments/comments.service';
import { Products } from 'src/entities/product.schema';
import { Comments } from 'src/entities/comment.schema';

@Controller('products') // 🟢 Đảm bảo có decorator này
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly commentService: CommentsService, // Thêm service Product vào đây
  ) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') search?: string,
    @Query('category_id') category_id?: string,
    @Query('is_featured') is_featured?: boolean,
  ): Promise<{ data: Products[]; total: number; page: number; limit: number }> {
    return this.productService.findAll(
      Number(page) || 1, // Mặc định page = 1 nếu không truyền
      Number(limit) || 10, // Mặc định limit = 10 nếu không truyền
      search,
      category_id,
      is_featured,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ data: Products }> {
    return this.productService.findOne(id);
  }

  @Get(':id/comments')
  async getCommentsByProductId(
    @Param('id') product_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{
    data: Comments[];
    pages: {
      total: number;
      currentPage: number;
      hasNext: boolean;
      hasPrev: boolean;
      next: number;
      prev: number;
    };
  }> {
    return this.commentService.getCommentsByProductId(
      Number(page) || 1, // Mặc định page = 1 nếu không truyền
      Number(limit) || 10, // Mặc định limit = 10 nếu không truyền
      product_id,
    );
  }
  @Post(':id/comments')
  async createComment(
    @Param('id') product_id: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('content') content: string,
  ): Promise<{
    status: string;
    data: Comments;
  }> {
    return this.commentService.createComment(product_id, name, email, content);
  }
}
