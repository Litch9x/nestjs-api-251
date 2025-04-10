import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path'; // Import path
import * as dotenv from 'dotenv'; // Import dotenv
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication
import * as session from 'express-session'; // Import express-session
import * as passport from 'passport'; // Import passport
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // Tải biến môi trường từ file .env
  dotenv.config();

  // Tạo ứng dụng với NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Phục vụ ảnh từ thư mục public/uploads
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'public/uploads/images')),
  );

  // session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: false },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  //chỉ định cookie-parser
  app.use(cookieParser()); // 👈 Thêm dòng này

  // Cấu hình EJS
  app.setViewEngine('ejs');

  // Đặt thư mục chứa các file view (template)
  app.setBaseViewsDir(join(__dirname, 'views'));

  // ✅ Bật CORS để cho phép Frontend truy cập API từ domain khác
  app.enableCors({
    origin: 'http://localhost:3000', // Cho phép frontend gọi API
    credentials: true, // Cho phép gửi cookies & authentication token
    allowedHeaders: ['Content-Type', 'Authorization', 'token'], // Cho phép header `token`
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Cho phép các method
  });

  // Lắng nghe cổng được cấu hình trong .env hoặc mặc định là 8000
  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
