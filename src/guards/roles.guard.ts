import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token not found');
    }

    try {
      const payload: { id: string; email: string } = this.jwtService.verify(
        refreshToken,
        { secret: this.configService.get<string>('JWT_REFRESHTOKEN_SECRET') },
      ); // Key để verify refresh token
      const user = await this.usersService.findByEmail(payload.email);
      // console.log('user', user);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('không có quyền truy cập');
      }

      request['user'] = user;
      return true;
    } catch (err: any) {
      throw new ForbiddenException(err || 'Invalid token');
    }
  }
}
