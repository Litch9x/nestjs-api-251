import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Request } from 'express'; // Thêm import Request từ express

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization
      jwtFromRequest: (req: Request) => {
        // 1. Thêm hàm xử lý trước khi lấy JWT
        const token = req.headers['authorization'];

        if (!token) {
          throw new Error('No token provided');
        }

        // 2. Bạn có thể thêm logic ở đây trước khi trả về token, ví dụ: kiểm tra quyền truy cập hoặc xử lý token
        const tokenParts = token.split(' ');
        if (tokenParts[0] !== 'Bearer') {
          throw new Error('Token format is incorrect');
        }

        //Check dirty refreshToken
        // const dirtyToken = this.authService.isBlacklisted(tokenParts[1]);

        // 3. Trả về token (sau khi xử lý)
        return tokenParts[1];
      }, // Lấy token từ header Authorization
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESSTOKEN_SECRET') || 'supersecretkey',
    });
  }

  async validate(payload: { id: string; email: string }) {
    return this.authService.validateJwtPayload(payload);
  }
}
