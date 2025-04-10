import { IsString, IsNotEmpty } from 'class-validator';

export class loginDto {
  // Define the expected properties of the body here
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
