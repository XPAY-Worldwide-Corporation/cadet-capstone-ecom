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
import { DiscountsService } from "./discounts.service";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { responseHandler } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";

@Controller()
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async findAll() {
    const data = await this.discountsService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No discounts found"
        : "All discounts retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.discountsService.getById(id);
    return responseHandler(data, "Discount retrieved successfully");
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.CUSTOMER)
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    const data = await this.discountsService.add({
      ...createDiscountDto,
    });

    return responseHandler(data, "Discount created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    const data = await this.discountsService.update(id, {
      ...updateDiscountDto,
    });

    return responseHandler(data, "Discount updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.discountsService.deleteById(id);
    return responseHandler(data, "Discount deleted successfully");
  }
}
