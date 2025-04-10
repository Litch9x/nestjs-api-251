import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { UserRole } from '../../enums/user-role.enum';
import { Request } from 'express';

@Controller('users')
export class RolesController {
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminData(@Req() req: Request) {
    return { message: 'Chỉ admin mới thấy dữ liệu này!', user: req.user };
  }

  @Get('all')
  getAllUsers() {
    return { message: 'Bất kỳ ai cũng có thể xem danh sách người dùng' };
  }
}
