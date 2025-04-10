import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  BadRequestException,
  UseGuards,
  Param,
  Res,
} from '@nestjs/common';
// Removed duplicate import of FileInterceptor
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminProductService } from './adminProducts.service';
import { Query } from '@nestjs/common';
import { CreateProductDto } from 'src/dtos/CreateProduct.dto';
import { Products } from 'src/entities/product.schema';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import fs from 'fs';
import path from 'path';

@Controller('admin/products')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminProductController {
  constructor(private readonly adminProductsService: AdminProductService) { }

  // Lấy tất cả sản phẩm với phân trang và tìm kiếm
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') search?: string,
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
    return this.adminProductsService.findAll(
      Number(page) || 1, // Mặc định page = 1 nếu không truyền
      Number(limit) || 10, // Mặc định limit = 10 nếu không truyền
      search,
    );
  }

  // Tạo sản phẩm mới
  @Post('create')
  //@UseGuards(JwtAuthGuard) // Bảo vệ route này bằng JWT
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/images/products', //Lưu file vào thư mục /public/uploads/
        filename: (req, file, callback) => {
          const fileName = file.originalname;
          callback(null, fileName);
        },
      }),
      //chặn các file không hợp lệ
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Chỉ cho phép upload ảnh!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    }),
  )
  createProduct(
    @Body() data: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(data, file);
    return this.adminProductsService.createProduct(data, file);
  }
  @Post(':id/update')
  //@UseGuards(JwtAuthGuard) // Bảo vệ route này bằng JWT
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/images/products', //Lưu file vào thư mục /public/uploads/
        filename: (req, file, callback) => {
          const fileName = file.originalname;
          callback(null, fileName);
        },
      }),
      //chặn các file không hợp lệ
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Chỉ cho phép upload ảnh!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    }),
  )
  updateProduct(
    @Param('id') id: string,
    @Body() data: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.adminProductsService.updateProduct(id, data, file);
  }

  //Delete Product
  @Get(':id/delete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteProduct(@Param('id') id: string) {
    return this.adminProductsService.deleteProduct(id);
  }
  //Detail Product
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  productDetail(@Param('id') id: string) {
    return this.adminProductsService.productDetail(id);
  }
}
