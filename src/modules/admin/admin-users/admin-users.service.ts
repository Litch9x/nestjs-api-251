import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Customers } from 'src/entities/customer.schema';
import { User } from 'src/entities/user.schema';
import { UserRole } from 'src/enums/user-role.enum';
import { paginate } from 'src/utils/paginate.util';
import { PaginationResult } from 'src/utils/pagination-result.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Customers.name) private customersModel: Model<Customers>,
  ) { }
  async getUsersList(
    limit: string,
    page: string,
  ): Promise<PaginationResult<User>> {
    return await paginate(this.userModel, {
      page: Number(page) || 1,
      limit: Number(limit) || 8,
      filter: {}, // có thể thêm filter nếu cần
      sort: { createdAt: -1 },
    });
  }

  async userDetail(id: string): Promise<{ data: User }> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new BadRequestException('User Not Exist');
    }
    return { data: user };
  }

  async userCreate(
    fullName: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User> {
    const user = {
      fullName,
      customer_id: new mongoose.Types.ObjectId(),
      email,
      password,
      role,
    };
    const isEmail = await this.userModel.findOne({ email });
    if (isEmail) {
      throw new BadRequestException('Email Existed');
    }

    const newUser = await new this.userModel(user).save();
    return newUser;
  }
  async userUpdate(
    id: string,
    fullName: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User> {
    const user_id = new Types.ObjectId(id);
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw new BadRequestException('User Invalid');
    }
    const isEmail = await this.userModel.findOne({ email });
    if (isEmail && isEmail.id !== id) {
      throw new BadRequestException('Email Existed');
    }
    const updateUser = await this.userModel.findByIdAndUpdate(
      user_id,
      { $set: { email, password, role, fullName } },
      { new: true },
    );

    if (!updateUser) {
      throw new BadRequestException('Update Failed');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.customersModel.findByIdAndUpdate(
      user.customer_id,
      { $set: { email, password: hashedPassword, role } },
      { new: true },
    );

    return updateUser;
  }

  async deleteUser(
    id: string,
  ): Promise<{ data: { user: User; status: string } }> {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new BadRequestException('User Not Exist');
    }
    await this.userModel.findByIdAndDelete(new Types.ObjectId(id));
    return { data: { user, status: 'Deleted Success' } };
  }
}
