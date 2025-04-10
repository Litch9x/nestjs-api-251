import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/role')
  async getRoleByCustomerId(
    @Param('id') id: string,
  ): Promise<User['role'] | null> {
    if (!id) {
      return null; // Trả về null nếu không có id
    }
    return this.usersService.getRoleByCustomerId(id);
  }
}
