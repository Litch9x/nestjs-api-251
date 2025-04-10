// create-user.dto.ts
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

export class UserCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;
}
