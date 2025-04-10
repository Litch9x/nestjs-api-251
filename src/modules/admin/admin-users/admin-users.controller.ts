import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { UserCreateDto } from 'src/dtos/UserCreate.dto';
import { UserUpdateDto } from 'src/dtos/UserUpdate.dto';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) { }
  @Get()
  async getUsersList(
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    return this.adminUsersService.getUsersList(limit, page);
  }

  @Get(':id')
  async userDetail(@Param('id') id: string) {
    return this.adminUsersService.userDetail(id);
  }
  @Post('create')
  async userCreate(@Body() createUserDto: UserCreateDto) {
    const { fullName, email, password, role } = createUserDto;
    return this.adminUsersService.userCreate(fullName, email, password, role);
  }
  @Post(':id/update')
  async userUpdate(@Body() updateUserDto: UserUpdateDto,@Param('id') id:string) {
    const { fullName, email, password, role } = updateUserDto;
    return this.adminUsersService.userUpdate(id, fullName, email, password, role);
  }
  @Post(':id/delete')
  async deleteUser(@Param('id') id: string) {
    return this.adminUsersService.deleteUser(id);
  }
}
