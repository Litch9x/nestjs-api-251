import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { Comments, CommentsSchema } from 'src/entities/comment.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    forwardRef(() => ProductsModule), // Đảm bảo có forwardRef
  ],
  controllers: [], // Đăng ký controller
  providers: [CommentsService], // Chưa có service
  exports: [MongooseModule, CommentsService], // Để module khác có thể sử dụng
})
export class CommentsModule {}
