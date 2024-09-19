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
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { responseHandler, multipleImages } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";
import { UploadImages } from "src/types";

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findAll() {
    const data = await this.productsService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No products found"
        : "All products retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.productsService.getById(id);
    return responseHandler(data, "Product retrieved successfully");
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  @UseInterceptors(FilesInterceptor("image"))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length === STATUSCODE.ZERO)
      throw new BadRequestException("At least one image is required.");

    const data = await this.productsService.add({
      ...createProductDto,
      image: uploadedImages,
    });

    return responseHandler(data, "Product created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  @UseInterceptors(FilesInterceptor("image"))
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const oldData = await this.productsService.getById(id);

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

    const data = await this.productsService.update(id, {
      ...updateProductDto,
      image: uploadNewImages,
    });

    return responseHandler(data, "Product updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.productsService.deleteById(id);

    const images =
      typeof data.image === "string"
        ? JSON.parse(data.image)
        : data.image || [];

    if (images?.length > 0) {
      const publicIds = images.map((image: UploadImages) => image.public_id);
      await multipleImages([], publicIds);
    }

    return responseHandler(data, "Product deleted successfully");
  }
}
