import { PartialType } from "@nestjs/mapped-types";
import { CreateCommentDto } from "./create-comment.dto";
import { Transform } from "class-transformer";
import { IsInt, Min, Max, IsString, IsNotEmpty } from "class-validator";
import { UploadImages } from "src/types";

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  ratings: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  image: UploadImages[];

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  transactionId: number;
}
