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
import { InventoryService } from "./inventories.service";
import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { UpdateInventoryDto } from "./dto/update-inventory.dto";
import { responseHandler } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async findAll() {
    const data = await this.inventoryService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No inventories found"
        : "All inventories retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.inventoryService.getById(id);
    return responseHandler(data, "Inventory retrieved successfully");
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    const data = await this.inventoryService.add(createInventoryDto);
    return responseHandler(data, "Inventory created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    const data = await this.inventoryService.update(id, updateInventoryDto);

    return responseHandler(data, "Inventory updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.inventoryService.deleteById(id);

    return responseHandler(data, "Inventory deleted successfully");
  }
}
