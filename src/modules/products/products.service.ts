import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products, ProductsDocument } from 'src/entities/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private productModel: Model<ProductsDocument>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
    category_id?: string,
    is_featured?: boolean,
  ): Promise<{
    data: Products[];
    total: number;
    page: number;
    limit: number;
    is_featured: boolean;
  }> {
    const query: {
      name?: { $regex: string; $options: string };
      category_id?: string;
      is_featured?: boolean;
    } = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category_id) {
      query.category_id = category_id;
    }
    if (is_featured) {
      query.is_featured = true;
    }

    const total = await this.productModel.countDocuments(query);
    const data = await this.productModel
      .find(query)
      .sort({ _id: -1 })
      .populate('category_id', 'name') // Chỉ lấy trường name từ category
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total, page, limit, is_featured: !!is_featured };
  }

  async findOne(id: string): Promise<{ data: Products }> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return { data: product };
  }
}
