import { PartialType } from "@nestjs/mapped-types";
import { CreateRefundDto } from "./create-refund.dto";
import { IsBoolean } from "class-validator";

export class UpdateRefundDto extends PartialType(CreateRefundDto) {
  @IsBoolean()
  isRefund: boolean;
}
