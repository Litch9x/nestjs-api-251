import { Controller, Get } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { Sliders } from 'src/entities/slider.schema';

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}
  @Get()
  async findAll(): Promise<{ data: Sliders[] }> {
    const sliders = await this.slidersService.findAll();
    return {
      data: sliders,
    };
  }
}
