import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banners, BannersDocument } from 'src/entities/banner.schema';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banners.name)
    private bannersModel: Model<BannersDocument>,
  ) {}
  async findAll(): Promise<Banners[]> {
    const banners = await this.bannersModel.find().exec();
    return banners;
  }
}
