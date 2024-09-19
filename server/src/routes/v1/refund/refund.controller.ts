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
import { RefundService } from "./refund.service";
import { CreateRefundDto } from "./dto/create-refund.dto";
import { UpdateRefundDto } from "./dto/update-refund.dto";
import { responseHandler } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";

@Controller()
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findAll() {
    const data = await this.refundService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No refunds found"
        : "All refunds retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.refundService.getById(id);
    return responseHandler(data, "Refund retrieved successfully");
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.CUSTOMER)
  async create(@Body() createRefundDto: CreateRefundDto) {
    const data = await this.refundService.add(createRefundDto);
    return responseHandler(data, "Refund created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateRefundDto: UpdateRefundDto,
  ) {
    const data = await this.refundService.update(id, updateRefundDto);

    return responseHandler(data, "Refund updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.refundService.deleteById(id);

    return responseHandler(data, "Refund deleted successfully");
  }
}
