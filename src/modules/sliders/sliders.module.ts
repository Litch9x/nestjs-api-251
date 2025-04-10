import { Module } from '@nestjs/common';
import { SlidersController } from './sliders.controller';
import { SlidersService } from './sliders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sliders, SlidersSchema } from 'src/entities/slider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sliders.name, schema: SlidersSchema }]),
  ],
  controllers: [SlidersController], // Chưa có controller
  providers: [SlidersService], // Chưa có service
  exports: [MongooseModule], // Để module khác có thể sử dụng
})
export class SlidersModule {}
