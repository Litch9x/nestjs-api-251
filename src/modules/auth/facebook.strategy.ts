import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tokens, TokensDocument } from 'src/entities/token.schema';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService, // Inject AuthService
    @InjectModel(Tokens.name)
    private tokenModel: Model<TokensDocument>,
  ) {
    const clientID = configService.get<string>('FACEBOOK_CLIENT_ID') as string;
    const clientSecret = configService.get<string>(
      'FACEBOOK_CLIENT_SECRET',
    ) as string;
    const callbackURL = configService.get<string>(
      'FACEBOOK_CALLBACK_URL',
    ) as string;
    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'displayName', 'emails'],
    });
  }

  async validate(
    req: Request, // ✅ Thêm req để đọc cookie
    accessToken: string,
    refreshToken: string,
    profile: { emails: { value: string }[] },
    // done: (error: any, user?: any) => void,
  ) {
    const { emails } = profile;
    const email: string = emails[0].value;
    // console.log('Facebook profile:', email);
    const customer = await this.authService.validateOAuthUser(email);
    // Tạo token JWT
    if (!customer) {
      throw new Error('Customer not found');
    }
    const newAccessToken = this.authService.generateAccessToken(customer);
    const newRefreshToken = this.authService.generateRefreshToken(customer);

    // Lưu refresh token vào cookie
    req.res?.cookie('refreshToken', newRefreshToken, {
      httpOnly: true, // Giúp ngăn chặn việc truy cập từ JavaScript
      secure: false, // Chỉ cho phép cookie qua HTTPS nếu TRUE
      maxAge: 7 * 24 * 60 * 60 * 1000, // Hết hạn sau 7 ngày
      sameSite: 'lax', // Cho phép cookie được gửi qua các miền khác
    });
    const token = new this.tokenModel({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      customer_id: customer._id,
    });
    // Lưu user vào DB
    await token.save();
    const user = {
      customer,
      token,
    };
    console.log('Facebook user:', user);
    return user; // ✅ Trả user về cho Passport
  }
}
