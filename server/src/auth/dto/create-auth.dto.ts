import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAuthDto {

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsNotEmpty()
   @IsString()
   password: string;

   @IsString()
   username?: string;

   @IsOptional()
   @IsString()
   signInAs: string;

   @IsOptional()
   @IsString()
   signUpAs: string;
}

