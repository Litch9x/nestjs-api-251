import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ObjectId } from 'mongoose';
import { Orders } from 'src/entities/order.schema';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('orders')
// @UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post('')
  @UseGuards(JwtAuthGuard) // Bảo vệ route này bằng JWT
  async order(
    @Body('customer_id') customer_id: string,
    @Body('totalPrice') totalPrice: number,
    @Body('items') items: { qty: number; prd_id: ObjectId; price: number }[],
    @Body('fullName') fullName: string,
    @Body('email') email: string,
    @Body('phone') phone: string,
    @Body('address') address: string,
  ): Promise<{ data: Orders }> {
    return await this.ordersService.order(
      customer_id,
      totalPrice,
      items,
      fullName,
      email,
      phone,
      address,
    );
  }

  @Get(':id/cancelled')
  @UseGuards(JwtAuthGuard) // Bảo vệ route này bằng JWT
  async orderCancelled(@Param('id') id: string): Promise<{ data: Orders }> {
    return await this.ordersService.orderCancelled(id);
  }

  @Get(':id/')
  @UseGuards(JwtAuthGuard) // Bảo vệ route này bằng JWT
  async orderDetail(@Param('id') id: string): Promise<{ data: Orders }> {
    return await this.ordersService.orderDetail(id);
  }
}
