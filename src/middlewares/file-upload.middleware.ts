import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import * as multer from 'multer';

@Injectable()
export class MulterService {
  static multerOptions(): Multer {
    return multer({
      dest: './uploads/', // Chỉ định thư mục lưu trữ file
    });
  }
}
