import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customers, CustomersSchema } from 'src/entities/customer.schema';
import { OrdersModule } from '../orders/orders.module';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { TokensModule } from '../tokens/tokens.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TokensModule,
    ConfigModule,
    UsersModule, // Import UsersModule nếu cần
    MongooseModule.forFeature([
      { name: Customers.name, schema: CustomersSchema },
    ]),
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
  controllers: [CustomersController],
  providers: [CustomersService, JwtService, AuthService], // Đảm bảo sử dụng JwtService ở đây
  exports: [MongooseModule, CustomersService],
})
export class CustomersModule {}
