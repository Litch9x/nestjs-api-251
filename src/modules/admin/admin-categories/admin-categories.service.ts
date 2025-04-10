import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Categories } from 'src/entities/category.schema';
import { paginate } from 'src/utils/paginate.util';
import { PaginationResult } from 'src/utils/pagination-result.interface';

@Injectable()
export class AdminCategoriesService {
  constructor(
    @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
  ) { }
  async getCategoriesList(
    limit: string,
    page: string,
  ): Promise<PaginationResult<Categories>> {
    return await paginate(this.categoriesModel, {
      page: Number(page) || 1,
      limit: Number(limit) || 8,
      filter: {}, // có thể thêm filter nếu cần
      sort: { createdAt: -1 },
    });
  }

  async categoriesDetail(id: string): Promise<{ data: Categories }> {
    const category = await this.categoriesModel.findById(
      new Types.ObjectId(id),
    );
    if (!category) {
      throw new BadRequestException('User Not Exist');
    }
    return { data: category };
  }

  async categoryCreate(name): Promise<Categories> {
    const isCategory = await this.categoriesModel.findOne({ name });
    if (isCategory) {
      throw new BadRequestException('Category Existed');
    }

    const newCategory = await new this.categoriesModel({ name }).save();
    return newCategory;
  }

  async categoryUpdate(id: string, name: string): Promise<Categories> {
    const category_id = new Types.ObjectId(id);
    const category = await this.categoriesModel.findById(category_id);
    if (!category) {
      throw new BadRequestException('Category ID Invalid');
    }
    const isCategory = await this.categoriesModel.findOne({ name });
    if (isCategory && isCategory.id !== id) {
      throw new BadRequestException('Category Existed');
    }
    const updateCategory = await this.categoriesModel.findByIdAndUpdate(
      category_id,
      { $set: { name } },
      { new: true },
    );
    if (!updateCategory) {
      throw new BadRequestException('Update Failed');
    }
    return updateCategory;
  }

  async deleteCategory(
    id: string,
  ): Promise<{ data: { category: Categories; status: string } }> {
    const category = await this.categoriesModel.findById(
      new Types.ObjectId(id),
    );
    if (!category) {
      throw new BadRequestException('Category Not Exist');
    }
    await this.categoriesModel.findByIdAndDelete(new Types.ObjectId(id));
    return { data: { category, status: 'Deleted Success' } };
  }
}
