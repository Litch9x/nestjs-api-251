import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Express } from 'express'; // ✅ Import kiểu file từ Express
import * as path from 'path'; // ✅ Import path để xử lý đường dẫn
import * as fs from 'fs'; // ✅ Bổ sung import fs
import { Products, ProductsDocument } from 'src/entities/product.schema';
import { CreateProductDto } from 'src/dtos/CreateProduct.dto';
import { paginate } from 'src/utils/paginate.util';
import { PaginationResult } from 'src/utils/pagination-result.interface';

@Injectable()
export class AdminProductService {
  constructor(
    @InjectModel(Products.name) private productsModel: Model<Products>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
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
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await this.productsModel.countDocuments(query);
    const products = await this.productsModel
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

  async createProduct(
    data: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Products> {
    const newProduct = {
      name: data.name,
      price: data.price,
      details: data.details,
      category_id: data.category_id,
      status: data.status,
      is_featured: data.is_featured ?? false,
      promotion: data.promotion,
      accessories: data.accessories,
      is_stock: data.is_stock,
      image: '', // Add the image property with an initial empty string
    };

    if (file) {
      const imagePath = `${file.originalname}`;
      // const savePath = path.resolve('src/public/uploads/images', imagePath);
      // fs.renameSync(file.path, savePath);
      newProduct.image = imagePath;
      const product = new this.productsModel(newProduct);
      return product.save();
    } else {
      throw new Error('File ảnh không hợp lệ');
    }
  }

  async updateProduct(
    id: string,
    data: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Products> {
    const product_id = new Types.ObjectId(id);
    const product = await this.productsModel.findById(product_id);
    if (!product) {
      throw new BadRequestException('Product ID Invalid');
    }
    const updateData = {
      ...data,
      image: file ? await this.saveImage(file) : product.image,
    };
    const updatedProduct = await this.productsModel.findByIdAndUpdate(
      product_id,
      updateData,
      { new: true },
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const product = await this.productsModel.findById(id);
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    // Xóa ảnh nếu có
    if (product.image) {
      const uploadDir = path.resolve('public/uploads/images', 'products');
      const imagePath = path.join(uploadDir, product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.productsModel.findByIdAndDelete(id);
    return { message: 'Đã xóa sản phẩm thành công' };
  }

  private async saveImage(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.resolve('public/uploads/images', 'products');

    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, file.originalname);

    try {
      await fs.promises.rename(file.path, uploadPath);
      return `${file.originalname}`;
    } catch (error) {
      console.error('Lỗi khi lưu ảnh:', error);
      throw new Error('Không thể lưu ảnh');
    }
  }

  async productDetail(id: string): Promise<{ data: Products }> {
    const product = await this.productsModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return { data: product };
  }

  async getProductsList(
    limit: string,
    page: string,
  ): Promise<PaginationResult<Products>> {
    return await paginate(this.productsModel, {
      page: Number(page) || 1,
      limit: Number(limit) || 8,
      filter: {}, // có thể thêm filter nếu cần
      sort: { createdAt: -1 },
    });
  }
}
