import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Orders, OrdersSchema } from 'src/entities/order.schema';
import { ProductsModule } from '../products/products.module';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
    ProductsModule,
    MailModule,
  ],
  controllers: [OrdersController], // Đăng ký controller
  providers: [OrdersService, MailService], // Chưa có service
  exports: [MongooseModule, OrdersService], // Để module khác có thể sử dụng
})
export class OrdersModule {}
