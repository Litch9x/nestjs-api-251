import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Products } from 'src/entities/product.schema';

@Injectable()
export class PaginationService {
  constructor(
    @InjectModel('Products')
    private readonly productModel: Model<Products>,
  ) {}
  async paginate(
    query: RootFilterQuery<Products> | undefined,
    page: number,
    limit: number,
  ): Promise<{
    page: {
      total: number;
      currentpage: number;
      hasNext: boolean;
      hasPrev: boolean;
      next: number;
      prev: number;
      limit: number;
    };
  }> {
    const total = await this.productModel.countDocuments(query).exec();
    const currentPage = page || 1;
    const limitPage = limit || 10;
    const hasNext = currentPage < total ? true : false;
    const hasPrev = currentPage > 1 ? true : false;
    const next = currentPage + 1;
    const prev = currentPage - 1;
    return {
      page: {
        total: total,
        currentpage: currentPage,
        hasNext: hasNext,
        hasPrev: hasPrev,
        next: next,
        prev: prev,
        limit: limitPage,
      },
    };
  }
}
