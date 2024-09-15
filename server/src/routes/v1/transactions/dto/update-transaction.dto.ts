import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionDto } from "./create-transaction.dto";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsString()
  @IsNotEmpty()
  status: string;
}
