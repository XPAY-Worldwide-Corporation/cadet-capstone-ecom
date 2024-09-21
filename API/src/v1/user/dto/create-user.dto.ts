import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UploadImages } from 'src/types';

enum UserRole {
  Merchant = 'Merchant',
  Customer = 'Customer',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  image: UploadImages[];

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role_name: UserRole;
}
