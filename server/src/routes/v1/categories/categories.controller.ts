import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";
import { multipleImages, responseHandler } from "src/utils";
import { UploadImages } from "src/types";

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findAll() {
    const data = await this.categoriesService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No categories found"
        : "All categories retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.categoriesService.getById(id);
    return responseHandler(data, "Category retrieved successfully");
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.add({
      ...createCategoryDto,
    });
    return responseHandler(data, "Category created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoriesService.update(id, {
      ...updateCategoryDto,
    });

    return responseHandler(data, "Category updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.categoriesService.deleteById(id);

    const extractImages = (products: any) =>
      products
        .flatMap((product: any) =>
          typeof product.image === "string"
            ? JSON.parse(product.image)
            : product.image || [],
        )
        .map((image: UploadImages) => image.public_id);

    const productImages = extractImages(data.Product || []);

    if (productImages.length > 0) await multipleImages([], productImages);

    return responseHandler(data, "Category deleted successfully");
  }
}
