import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { Banners, BannersSchema } from 'src/entities/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banners.name, schema: BannersSchema }]),
  ],
  controllers: [BannersController], // Chưa có controller
  providers: [BannersService], // Chưa có service
  exports: [MongooseModule], // Để module khác có thể sử dụng
})
export class BannersModule {}
