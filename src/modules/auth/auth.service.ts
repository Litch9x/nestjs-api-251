import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from '../customers/customers.service';
import { Customers } from 'src/entities/customer.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { jwtDecode } from 'jwt-decode';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  // ✅ Xác thực user bằng email & password (cho LocalStrategy)
  async validateUser(
    email: string,
    password: string,
  ): Promise<Customers | UnauthorizedException> {
    // Kiểm tra xem email có tồn tại không
    const user = await this.customersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user || user instanceof Error) {
      throw new UnauthorizedException('Invalid OAuth user');
    }
    if (user instanceof Error) {
      throw new UnauthorizedException('Invalid OAuth user');
    }

    return user;
  }

  // ✅ Tạo JWT access token
  generateAccessToken(user: Customers) {
    const payload = { id: user._id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESSTOKEN_SECRET'),
      expiresIn: '1h', // Access Token có thời gian sống là 7 ngày
    });
  }
  // ✅ Tạo JWT refresh token
  generateRefreshToken(user: Customers) {
    const payload = { id: user._id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESHTOKEN_SECRET'),
      expiresIn: '7d', // Access Token có thời gian sống là 7 ngày
    });
  }

  // Phương thức giải mã Refresh Token và lấy thông tin người dùng
  async getCustomerByRefreshToken(refreshToken: string) {
    try {
      // Giải mã refresh token để lấy payload
      // Define the expected payload structure
      const payload: { id: string; email: string } = this.jwtService.verify(
        refreshToken,
        { secret: this.configService.get<string>('JWT_REFRESHTOKEN_SECRET') },
      ); // Key để verify refresh token

      // Tìm người dùng trong database dựa trên ID trong payload
      const customer = await this.customersService.findByEmail(payload.email);
      if (!customer) {
        throw new UnauthorizedException('User not found');
      }

      return customer;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ✅ Xác thực user từ JWT payload (cho JwtStrategy)
  async validateJwtPayload(payload: { id: string; email: string }) {
    // console.log('JWT payload:', payload);
    const user = await this.customersService.findByEmail(payload.email);
    // console.log('JWT user:', user);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user; // 🟢 Gán vào `req.user`
  }

  // ✅ Xác thực OAuth (Google, Facebook, GitHub, etc.)
  async validateOAuthUser(email: string) {
    const user = await this.customersService.findByEmail(email);
    return user;
  }

  //REDIS
  //Save to token to blacklist REDIS
  async setTokenBlackList(token: string): Promise<void> {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentUnix = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - currentUnix;

      if (ttl > 0) {
        await this.redisClient.set(token, 'blacklisted', 'EX', ttl); // TTL tính bằng giây
      }
    } catch (error) {
      console.error('Lỗi khi decode token:', error);
    }
  }
  // async setTokenToBlacklist(token: string, exp: number) {
  //   const ttlInSeconds = exp - Math.floor(Date.now() / 1000);
  //   if (ttlInSeconds > 0) {
  //     await this.redisClient.set(token, 'blacklist', 'EX', ttlInSeconds);
  //   }
  // }

  //Check blacklist REDIS
  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return result === 'blacklist';
  }
}
