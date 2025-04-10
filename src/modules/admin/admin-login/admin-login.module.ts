import { forwardRef, Module } from '@nestjs/common';
import { AdminLoginController } from './admin-login.controller';
import { TokensModule } from 'src/modules/tokens/tokens.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/modules/users/users.module';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CustomersService } from 'src/modules/customers/customers.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { AdminLoginService } from './admin-login.service';
import { ProductsModule } from 'src/modules/products/products.module';
import { CommentsModule } from 'src/modules/comments/comments.module';

@Module({
  imports: [
    TokensModule,
    ConfigModule,
    UsersModule, // Import UsersModule nếu cần
    CustomersModule,
    ProductsModule,
    CommentsModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESSTOKEN_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => OrdersModule), // Đảm bảo có forwardRef
    forwardRef(() => AuthModule), // Import AuthModule ở đây
  ],
  controllers: [AdminLoginController],
  providers: [CustomersService, JwtService, AuthService, AdminLoginService], // Đảm bảo sử dụng JwtService ở đây
  exports: [],
})
export class AdminLoginModule {}
