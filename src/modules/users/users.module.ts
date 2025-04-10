import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController], // Nếu có controller thì thêm vào đây
  providers: [UsersService], // Nếu có service thì thêm vào đây
  exports: [MongooseModule, UsersService], // Để module khác có thể sử dụng
})
export class UsersModule {}
