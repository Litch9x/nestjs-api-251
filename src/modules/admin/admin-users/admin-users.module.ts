import { Module } from '@nestjs/common';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';

@Module({
  imports: [UsersModule, CustomersModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersModule {}
