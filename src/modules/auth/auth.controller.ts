import { Controller, UseGuards, Req, Res, Get } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { Response } from 'express'; // ✅ Import từ Express
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { FacebookAuthGuard } from 'src/guards/facebook-auth.guard';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { CustomersService } from '../customers/customers.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tokens, TokensDocument } from 'src/entities/token.schema';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(Tokens.name) private TokensModel: Model<TokensDocument>,
    private authService: AuthService,
    private customersService: CustomersService,
    private jwtService: JwtService, // Inject JwtService
    private readonly configService: ConfigService,
  ) {}
  @Get('refreshtoken')
  async refresh(
    @Req() req: Request & { cookies: { refreshToken?: string } },
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken; // lấy từ cookie
    if (!refreshToken) {
      return res.status(400).send('Refresh Token is required');
    }
    //Check dirty refreshToken
    const dirtyToken = await this.authService.isBlacklisted(refreshToken);
    if (dirtyToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
      });
    }

    const customer =
      await this.authService.getCustomerByRefreshToken(refreshToken);
    if (!customer) {
      return res.status(401).send('Invalid Refresh Token');
    }
    const newAccessToken = this.authService.generateAccessToken(customer);
    await this.TokensModel.findOneAndUpdate(
      { refreshToken },
      { accessToken: newAccessToken },
    );
    return res.status(200).json({ accessToken: newAccessToken });
  }

  @UseGuards(JwtAuthGuard)
  getProtectedRoute(@Req() req: Request) {
    return {
      message: 'You have accessed a protected route!',
      user: req.user as { id: string; email: string },
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard) // Khi vào đường dẫn này, Google OAuth sẽ được kích hoạt
  async googleAuth() {
    // Passport sẽ tự động xử lý redirect tới Google OAuth
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    // Bạn có thể xử lý token hoặc chuyển hướng đến trang ứng dụng của mình
    res.redirect(`http://localhost:3000`);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard) // Khi vào đường dẫn này, Facebook OAuth sẽ được kích hoạt
  async facebookAuth() {
    // Passport sẽ tự động xử lý redirect tới Facebook OAuth
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookAuthRedirect(
    @Req() req: Request & { user?: { email: string; password: string } },
    @Res() res: Response,
  ) {
    // Khi Facebook trả về, Passport sẽ xác thực người dùng và trả lại thông tin
    const user = req.user as
      | { customer?: { email: string; password: string }; token?: string }
      | undefined;
    console.log('User from Facebook:', user);
    if (!user || !user.customer) {
      return res.status(401).send('Unauthorized !!!!!!!!!!!!!!');
    }
    const { customer } = user;
    console.log('User from Facebook:', user);
    if (!customer || !customer.email || !customer.password) {
      return res.status(401).send('Unauthorized !!!!!!!!!!!!!!');
    }
    // return this.customersService.login(user.email, user.password, res);
    return res.status(200).json({
      message: 'Login successful',
      data: user,
    });
  }
}
