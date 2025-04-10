import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customers, CustomersDocument } from 'src/entities/customer.schema';
import { Tokens, TokensDocument } from 'src/entities/token.schema';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserRole } from 'src/enums/user-role.enum';
import { Products, ProductsDocument } from 'src/entities/product.schema';
import { Comments, CommentsDocument } from 'src/entities/comment.schema';

@Injectable()
export class AdminLoginService {
  constructor(
    @InjectModel(Customers.name)
    private customerModel: Model<CustomersDocument>,
    @InjectModel(Tokens.name)
    private tokenModel: Model<TokensDocument>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // Inject RedisService
    @InjectModel(Products.name)
    private productModel: Model<ProductsDocument>,
    @InjectModel(Comments.name)
    private commentModel: Model<CommentsDocument>,
  ) {}

  async loginAdmin(
    email: string,
    password: string,
    res: Response, // ✅ Thêm Response vào đây
    req: Request & { session: { accessToken?: string } }, // ✅ Định nghĩa kiểu cho req với session
  ): Promise<Response> {
    const isEmail = await this.customerModel.findOne({ email });

    if (!isEmail) {
      throw new BadRequestException({
        message: 'Email not valid',
        statusCode: 400,
      });
    }
    const isPassword = await bcrypt.compare(password, isEmail.password);
    if (!isPassword) {
      throw new BadRequestException('password not valid');
    }

    // Check role ADMIN
    const customer_id = isEmail?._id.toString();
    const role = await this.usersService.getRoleByCustomerId(customer_id); // Lấy role từ userId

    if (!role || role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin Role Required');
    }
    //check if token is exist in db
    const isToken = await this.tokenModel.findOne({
      customer_id: new Types.ObjectId(isEmail._id),
    });
    if (isToken) {
      //move to blacklist redis
      await this.authService.setTokenBlackList(isToken.accessToken);
      await this.authService.setTokenBlackList(isToken.refreshToken);
      //delete old token
      await this.tokenModel.deleteOne({
        customer_id: new Types.ObjectId(isEmail._id),
      });
    }

    // Tạo token JWT
    const accessToken = this.authService.generateAccessToken(isEmail);
    const refreshToken = this.authService.generateRefreshToken(isEmail);

    // Lưu refresh token vào cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Giúp ngăn chặn việc truy cập từ JavaScript
      secure: false, // Chỉ cho phép cookie qua HTTPS nếu TRUE
      maxAge: 7 * 24 * 60 * 60 * 1000, // Hết hạn sau 7 ngày
      sameSite: 'lax', // Cho phép cookie được gửi qua các miền khác
    });

    req.session.accessToken = accessToken;

    const token = new this.tokenModel({
      accessToken,
      refreshToken,
      customer_id: new Types.ObjectId(isEmail._id),
    });
    // Lưu user vào DB
    await token.save();
    // Trả về token
    // Trả về thông tin customer và token
    return res.json({ data: { customer: isEmail, token, role } }); // ✅ Đảm bảo trả về res với dữ liệu đúng
  }
  async dashboard(): Promise<{
    data: {
      totalProducts: number;
      totalCustomers: number;
      totalComments: number;
    };
  }> {
    const totalProducts = await this.productModel.find().countDocuments();
    const totalCustomers = await this.customerModel.find().countDocuments();
    const totalComments = await this.commentModel.find().countDocuments();
    return {
      data: {
        totalProducts,
        totalCustomers,
        totalComments,
      },
    };
  }
}
