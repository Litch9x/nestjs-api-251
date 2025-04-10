import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Categories, CategoriesDocument } from 'src/entities/category.schema';
import { Products, ProductsDocument } from 'src/entities/product.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name)
    private categoriesModel: Model<CategoriesDocument>,

    @InjectModel(Products.name)
    private productModel: Model<ProductsDocument>,
  ) {}

  async findAll(): Promise<Categories[]> {
    return this.categoriesModel.find().select('-__v').exec(); // ✅ Loại bỏ trường không cần thiết
  }
  async findById(id: string): Promise<Categories> {
    const category = await this.categoriesModel
      .findById(id)
      .select('-__v')
      .exec(); // ✅ Loại bỏ trường không cần thiết
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
  async getProductByCategory(
    page: number,
    limit: number,
    search?: string,
    category_id?: string,
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
      category_id?: mongoose.Types.ObjectId;
    } = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category_id) {
      query.category_id = new mongoose.Types.ObjectId(category_id);
    }
    const total = await this.productModel.countDocuments(query);
    const products = await this.productModel
      .find(query)
      .sort({ _id: -1 })
      .populate('category_id', 'name') // Chỉ lấy trường name từ category
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const currentPage = page;
    const next = page + 1;
    const prev = page - 1;
    const totalPages = Math.ceil(total / limit);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

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
