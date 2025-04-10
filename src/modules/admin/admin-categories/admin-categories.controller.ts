import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AdminCategoriesService } from './admin-categories.service';
import { name } from 'ejs';

@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(
    private readonly adminCategoriesService: AdminCategoriesService,
  ) { }
  @Get()
  async getCategoriesList(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    return this.adminCategoriesService.getCategoriesList(limit, page);
  }

  @Get(':id')
  async categoriesDetail(@Param('id') id: string) {
    return this.adminCategoriesService.categoriesDetail(id);
  }
  @Post('create')
  async categoryCreate(@Body('name') name: string) {
    return this.adminCategoriesService.categoryCreate(name);
  }
  @Post(':id/update')
  async categoryUpdate(@Param('id') id: string, @Body('name') name: string) {
    return this.adminCategoriesService.categoryUpdate(id, name);
  }
  @Post(':id/delete')
  async deleteCategory(@Param('id') id: string) {
    return this.adminCategoriesService.deleteCategory(id);
  }
}
