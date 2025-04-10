import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/entities/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Tìm người dùng theo email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  // Lấy role của người dùng theo id
  async getRoleByCustomerId(id?: string): Promise<User['role'] | null> {
    if (!id) {
      return null; // Nếu không có id, trả về null
    }
    const customer_id = new Types.ObjectId(id); // Chuyển id thành ObjectId hợp lệ
    const user = await this.userModel.findOne({ customer_id });
    // console.log('user', user);
    return user?.role || null; // Trả về role nếu tìm thấy người dùng, nếu không trả về null
  }
}
