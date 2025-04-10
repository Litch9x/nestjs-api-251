import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sliders, SlidersDocument } from 'src/entities/slider.schema';

@Injectable()
export class SlidersService {
  constructor(
    @InjectModel(Sliders.name)
    private slidersModel: Model<SlidersDocument>,
  ) {}
  async findAll(): Promise<Sliders[]> {
    const sliders = await this.slidersModel.find().exec();
    return sliders;
  }
}
