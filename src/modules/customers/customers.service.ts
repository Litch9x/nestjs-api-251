import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Customers, CustomersDocument } from 'src/entities/customer.schema';
import { AuthService } from '../auth/auth.service';
import { Tokens, TokensDocument } from 'src/entities/token.schema';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from 'src/entities/user.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customers.name)
    private customerModel: Model<CustomersDocument>,
    @InjectModel(Tokens.name)
    private tokenModel: Model<TokensDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // Inject RedisService
  ) {}
  // 📝 Đăng ký user mới
  async create(
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string,
  ): Promise<{
    data: Customers;
  }> {
    const isEmail = await this.customerModel.findOne({ email });
    const isPhone = await this.customerModel.findOne({ phone });
    if (isEmail) {
      throw new BadRequestException('email existed!');
    }
    if (isPhone) {
      throw new BadRequestException('phone existed');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new this.customerModel({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
    });
    const customer = await newCustomer.save();
    await new this.userModel({
      fullName,
      email,
      password,
      customer_id: customer._id,
    }).save();

    return { data: customer };
  }

  async updateCustomer(
    id: string,
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string,
  ): Promise<{ data: Customers }> {
    const customer_id = new Types.ObjectId(id);
    const customer = await this.customerModel.findById(customer_id);
    if (!customer) {
      throw new BadRequestException('Customer Invalid');
    }
    const updateCustomer = {
      email,
      password,
      fullName,
      phone,
      address,
    };
    const isPhone = await this.customerModel.findOne({ phone });
    if (isPhone && isPhone.id !== id) {
      throw new BadRequestException('Phone Existed');
    }

    const updated = await this.customerModel.findByIdAndUpdate(
      customer_id,
      updateCustomer,
      { new: true },
    );
    if (!updated) {
      throw new BadRequestException('Update Failed');
    }
    return { data: updated };
  }

  async login(
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
    const customer_id = isEmail?._id.toString();
    const role = await this.usersService.getRoleByCustomerId(customer_id); // Lấy role từ userId

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
  // 📝 Đăng xuất
  async logout(refreshToken: string) {
    //move to blacklist redis
    const token = await this.tokenModel.findOne({ refreshToken });
    if (token) {
      await this.authService.setTokenBlackList(refreshToken);
      await this.authService.setTokenBlackList(token?.accessToken);
    }
    //delete old token database
    await this.tokenModel.deleteMany({ refreshToken }); // Xoá hết token của user
  }

  // 🔐 Tìm user theo email để xác thực đăng nhập
  async findByEmail(email: string): Promise<Customers | null> {
    return this.customerModel.findOne({ email }).exec();
  }
  // 🔐 Tìm user theo id
  async findById(id: string): Promise<Customers | null> {
    return this.customerModel.findById(id).exec();
  }

  // ✅ Xác thực email + password (dùng trong local strategy hoặc AuthService)
  async validateUser(email: string, password: string): Promise<Customers> {
    const user = await this.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new NotFoundException('Invalid email or password');
    }
    return user;
  }
  async createOAuthUser(email: string): Promise<Customers> {
    let user = await this.findByEmail(email);
    if (user) {
      return user; // 🔁 Nếu đã có thì trả về luôn
    }
    // ⚠️ OAuth không có password, nên set rỗng hoặc chuỗi mặc định
    const newUser = new this.customerModel({
      email,
      password: '123456', // hoặc 'oauth_placeholder'
    });
    user = await newUser.save();
    return user;
  }
}
