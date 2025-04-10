import { Controller, Get } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Banners } from 'src/entities/banner.schema';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}
  @Get()
  async findAll(): Promise<{ data: Banners[] }> {
    const banners = await this.bannersService.findAll();
    return {
      data: banners,
    };
  }
}
