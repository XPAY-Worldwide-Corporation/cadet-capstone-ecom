import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { UploadImages } from 'src/types';

// Define the possible roles
enum UserRole {
  Merchant = 'Merchant',
  Customer = 'Customer',
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
