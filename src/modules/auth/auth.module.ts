import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersModule } from '../customers/customers.module';
import { CustomersService } from '../customers/customers.service';
import { TokensModule } from '../tokens/tokens.module';
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './OAuth.strategy';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule, // ✅ Import PassportModule để sử dụng Passport
    TokensModule, // ✅ Import TokensModule nếu dùng
    ConfigModule.forRoot(), // ✅ Import ConfigModule nếu dùng .env
    RedisModule, // ✅ Import RedisModule nếu dùng Redis
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESSTOKEN_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => CustomersModule), // Import CustomersModule để sử dụng CustomersService
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    CustomersService,
    GoogleStrategy,
    FacebookStrategy,
    RedisService,
    UsersService,
  ], // Đăng ký AuthService, JwtStrategy và JwtService
  controllers: [AuthController],
  exports: [AuthService, JwtModule, AuthModule, RedisService], // Xuất AuthService và JwtModule để sử dụng ở module khác
})
export class AuthModule {}
