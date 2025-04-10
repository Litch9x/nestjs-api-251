import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomersService } from './customers.service';
import { OrdersService } from '../orders/orders.service';
import { Customers } from 'src/entities/customer.schema';
import { Orders } from 'src/entities/order.schema';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly ordersService: OrdersService,
  ) {}
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<{ data: Customers }> {
    return await this.customersService.create(
      email,
      password,
      fullName,
      phone,
      address,
    );
  }
  @Post(':id/update')
  async updateCustomer(
    @Param('id') id: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<{ data: Customers }> {
    return await this.customersService.updateCustomer(
      id,
      email,
      password,
      fullName,
      phone,
      address,
    );
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response, // Thêm @Res() để nhận đối tượng Response
    @Req() req: Request & { session: { accessToken?: string } }, // Định nghĩa kiểu cho req với session
  ): Promise<Response> {
    return await this.customersService.login(email, password, res, req);
  }

  @Get('/logout')
  async logout(
    @Res() res: Response,
    @Req()
    req: Request & { cookies: { refreshToken?: string }; accessToken: string },
  ) {
    const refreshToken = req.cookies?.['refreshToken'];
    // Thêm @Res() để nhận đối tượng Response
    if (!refreshToken) {
      throw new BadRequestException('Missing refresh token!');
    }

    await this.customersService.logout(refreshToken);
    res.clearCookie('refreshToken'); // Xóa cookie refreshToken

    return res.status(200).json({ message: 'Logout thành công!' });
  }

  @Get(':id/orders')
  @UseGuards(JwtAuthGuard) // Bảo vệ route này bằng JWT
  async orderList(
    @Param('id') customer_id: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    return await this.ordersService.orderList(limit, page, customer_id);
  }
}
