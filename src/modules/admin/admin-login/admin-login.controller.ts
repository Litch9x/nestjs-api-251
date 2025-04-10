import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AdminLoginService } from './admin-login.service';
import { Response } from 'express';

@Controller('admin')
export class AdminLoginController {
  constructor(private readonly adminLoginService: AdminLoginService) {}
  @Post('login')
  async loginAdmin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response, // Thêm @Res() để nhận đối tượng Response
    @Req() req: Request & { session: { accessToken?: string } }, // Định nghĩa kiểu cho req với session
  ): Promise<Response> {
    return await this.adminLoginService.loginAdmin(email, password, res, req);
  }

  @Get('dashboard')
  async dashboard() {
    return await this.adminLoginService.dashboard();
  }
}
