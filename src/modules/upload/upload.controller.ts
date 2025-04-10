import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: 'No file uploaded!' };
    }

    // Định nghĩa đường dẫn mới cho file
    const uploadDir = path.resolve('public/uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newFilePath = path.join(uploadDir, file.originalname);
    fs.renameSync(file.path, newFilePath);

    return {
      message: 'File uploaded successfully!',
      filename: file.originalname,
      path: `/uploads/${file.originalname}`,
    };
  }
}
