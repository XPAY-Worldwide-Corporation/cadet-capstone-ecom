import { PartialType } from "@nestjs/mapped-types";
import { CreateMerchantDto } from "./create-merchant.dto";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsInt,
} from "class-validator";
import { Transform } from "class-transformer";
import { UploadImages, VerifyCode } from "src/types";

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  verificationCode?: VerifyCode;

  image: UploadImages[];

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  roleId: number;
}
