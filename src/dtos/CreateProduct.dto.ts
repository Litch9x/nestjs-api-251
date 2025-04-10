import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  // Define the expected properties of the body here
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  price: string;
  @IsString()
  @IsNotEmpty()
  details: string;
  @IsString()
  @IsNotEmpty()
  category_id: string;
  @IsString()
  @IsNotEmpty()
  status: string;
  is_featured: boolean;
  @IsString()
  @IsNotEmpty()
  promotion: string;
  @IsString()
  @IsNotEmpty()
  accessories: string;
  is_stock: boolean;
  // image: string;
}
