import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './configs/database.config';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsController } from './modules/products/products.controller';
import { AdminProductController } from './modules/admin/adminProducts/adminProducts.controller';
import { BannersController } from './modules/banners/banners.controller';
import { SearchController } from './modules/search/search.controller';
import { OrdersController } from './modules/orders/orders.controller';
import { CustomersController } from './modules/customers/customers.controller';
import { ProductsService } from './modules/products/products.service';
import { AdminProductModule } from './modules/admin/adminProducts/adminProducts.module';
import { UploadModule } from './modules/upload/upload.module';
import { SlidersModule } from './modules/sliders/sliders.module';
import { BannersModule } from './modules/banners/banners.module';
import { PaginationModule } from './modules/pagination/pagination.module';
import { CommentsModule } from './modules/comments/comments.module';
import { SearchModule } from './modules/search/search.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { MailModule } from './modules/mail/mail.module';
import { AdminProductService } from './modules/admin/adminProducts/adminProducts.service';
import { SlidersService } from './modules/sliders/sliders.service';
import { BannersService } from './modules/banners/banners.service';
import { PaginationService } from './modules/pagination/pagination.service';
import { CommentsService } from './modules/comments/comments.service';
import { SearchService } from './modules/search/search.service';
import { OrdersService } from './modules/orders/orders.service';
import { CustomersService } from './modules/customers/customers.service';
import { MailService } from './modules/mail/mail.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { RolesController } from './modules/roles/roles.controller';
import { LocalStrategy } from './modules/auth/local.strategy';
import { SessionSerializer } from './modules/auth/session.serializer';
import { RedisService } from './modules/redis/redis.service';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { AdminLoginService } from './modules/admin/admin-login/admin-login.service';
import { AdminLoginModule } from './modules/admin/admin-login/admin-login.module';
import { AdminCategoriesService } from './modules/admin/admin-categories/admin-categories.service';
import { AdminCategoriesModule } from './modules/admin/admin-categories/admin-categories.module';
import { AdminUsersController } from './modules/admin/admin-users/admin-users.controller';
import { AdminUsersService } from './modules/admin/admin-users/admin-users.service';
import { AdminUsersModule } from './modules/admin/admin-users/admin-users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Cấu hình để biến môi trường có thể sử dụng toàn bộ ứng dụng
      envFilePath: '.env', // Đảm bảo đường dẫn đến file .env chính xác
    }), // Load biến môi trường
    // Sử dụng mongooseConfig đã được tạo riêng biệt
    MongooseModule.forRootAsync({
      useFactory: mongooseConfig, // Sử dụng factory function từ mongooseConfig
      inject: [ConfigService], // Inject ConfigService để lấy giá trị từ .env
    }),
    ProductsModule,
    CategoriesModule,
    ProductsModule,
    AdminProductModule,
    UploadModule,
    SlidersModule,
    BannersModule,
    PaginationModule,
    CommentsModule,
    SearchModule,
    OrdersModule,
    CustomersModule,
    MailModule,
    AuthModule,
    TokensModule,
    UsersModule,
    AdminLoginModule,
    AdminCategoriesModule,
    AdminUsersModule,
    // RedisModule,
  ],
  controllers: [
    AppController,
    ProductsController,
    AdminProductController,
    BannersController,
    SearchController,
    OrdersController,
    CustomersController,
    AuthController,
    RolesController,
    AdminUsersController,
  ],
  providers: [
    AppService,
    ProductsService,
    AdminProductService,
    SlidersService,
    BannersService,
    PaginationService,
    CommentsService,
    SearchService,
    OrdersService,
    CustomersService,
    MailService,
    AuthService,
    LocalStrategy,
    SessionSerializer,
    RedisService,
    UsersService,
    AdminLoginService,
    AdminCategoriesService,
    AdminUsersService,
  ],
})
export class AppModule {}
