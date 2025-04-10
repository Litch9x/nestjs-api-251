// create-user.dto.ts
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

export class UserUpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  id: string;

  @IsEnum(UserRole)
  role: UserRole;


  @IsString()
  fullName: string;
}
