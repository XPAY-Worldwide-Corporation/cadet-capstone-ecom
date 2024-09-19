import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { responseHandler, multipleImages } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";
import { UploadImages } from "src/types";

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findAll() {
    const data = await this.commentsService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No comments found"
        : "All comments retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.commentsService.getById(id);
    return responseHandler(data, "Comment retrieved successfully");
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.CUSTOMER)
  @UseInterceptors(FilesInterceptor("image"))
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw new BadRequestException("At least one image is required.");

    const data = await this.commentsService.add({
      ...createCommentDto,
      image: uploadedImages,
    });

    return responseHandler(data, "Comment created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.CUSTOMER)
  @UseInterceptors(FilesInterceptor("image"))
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const oldData = await this.commentsService.getById(id);

    const oldImages =
      typeof oldData.image === "string"
        ? JSON.parse(oldData.image)
        : oldData.image || [];

    const uploadNewImages = files?.length
      ? await multipleImages(
          files,
          oldImages.map((image: UploadImages) => image.public_id),
        )
      : oldImages;

    const data = await this.commentsService.update(id, {
      ...updateCommentDto,
      image: uploadNewImages,
    });

    return responseHandler(data, "Comment updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.commentsService.deleteById(id);

    const images =
      typeof data.image === "string"
        ? JSON.parse(data.image)
        : data.image || [];

    if (images?.length > 0) {
      const publicIds = images.map((image: UploadImages) => image.public_id);
      await multipleImages([], publicIds);
    }

    return responseHandler(data, "Comment deleted successfully");
  }
}
