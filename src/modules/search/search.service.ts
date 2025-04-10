import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products, ProductsDocument } from 'src/entities/product.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Products.name) private productModel: Model<ProductsDocument>,
  ) {}

  async searchName(
    page: number,
    limit: number,
    keyword?: string,
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
    const query: {
      name?: { $regex: string; $options: string };
    } = {};
    // console.log(keyword);
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    // console.log('Query tìm kiếm:', query);

    const total = await this.productModel.countDocuments(query);
    // console.log(total);
    const products = await this.productModel
      .find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const currentPage = page;
    const next = page + 1;
    const prev = page - 1;
    const totalPages = Math.ceil(100 / limit);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    // console.log(total, currentPage, hasNext, hasPrev, next, prev);
    return {
      data: products,
      pages: {
        total,
        currentPage,
        hasNext,
        hasPrev,
        next,
        prev,
      },
    };
  }
}
