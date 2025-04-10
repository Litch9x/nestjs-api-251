import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Nơi lưu file tạm thời
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
