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
import { MerchantsService } from "./merchants.service";
import { CreateMerchantDto } from "./dto/create-merchant.dto";
import { UpdateMerchantDto } from "./dto/update-merchant.dto";
import { responseHandler, multipleImages } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";
import { UploadImages } from "src/types";

@Controller()
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  async findAll() {
    const data = await this.merchantsService.getAll();
    return responseHandler(
      data,
      data?.length === STATUSCODE.ZERO
        ? "No merchants found"
        : "All merchants retrieved successfully",
    );
  }

  @Get(PATH.ID)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.merchantsService.getById(id);
    return responseHandler(data, "Merchant retrieved successfully");
  }

  @Post()
  @UseInterceptors(FilesInterceptor("image"))
  async create(
    @Body() createMerchantDto: CreateMerchantDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages?.length === STATUSCODE.ZERO)
      throw new BadRequestException("At least one image is required.");

    const data = await this.merchantsService.add({
      ...createMerchantDto,
      image: uploadedImages,
    });

    return responseHandler(data, "Merchant created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  @UseInterceptors(FilesInterceptor("image"))
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const oldData = await this.merchantsService.getById(id);

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

    const data = await this.merchantsService.edit(id, {
      ...updateMerchantDto,
      image: uploadNewImages,
    });

    return responseHandler(data, "Merchant updated successfully");
  }

  @Delete(PATH.DELETE)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.merchantsService.delete(id);

    const images =
      typeof data.image === "string"
        ? JSON.parse(data.image)
        : data.image || [];

    if (images?.length > 0) {
      const publicIds = images.map((image: UploadImages) => image.public_id);
      await multipleImages([], publicIds);
    }

    return responseHandler(data, "Merchant deleted successfully");
  }
}
