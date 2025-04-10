import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Sử dụng TUser để duy trì tính linh hoạt
  handleRequest<TUser>(
    err: any,
    user: TUser | null,
    info: any,
    context: ExecutionContext,
  ): TUser {
    // Kiểm tra và ném lỗi nếu không có user
    if (err || !user) {
      throw err || new UnauthorizedException('Token Expired');
    }

    // Lấy request và gán user vào request với kiểu an toàn
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: TUser }>();
    request.user = user;
    // Trả về user (dùng user đã xác thực)
    return user;
  }
}
