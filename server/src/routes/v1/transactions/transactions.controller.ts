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
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { responseHandler } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findAll() {
    const data = await this.transactionsService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No transactions found"
        : "All transactions retrieved successfully",
    );
  }

  @Get(PATH.ID)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.transactionsService.getById(id);
    return responseHandler(data, "Transaction retrieved successfully");
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.CUSTOMER)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const data = await this.transactionsService.add({
      ...createTransactionDto,
    });

    return responseHandler(data, "Transaction created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT, ROLE.CUSTOMER)
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const data = await this.transactionsService.update(id, {
      ...updateTransactionDto,
    });

    return responseHandler(data, "Transaction updated successfully");
  }

  @Delete(PATH.DELETE)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.MERCHANT)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.transactionsService.deleteById(id);
    return responseHandler(data, "Transaction deleted successfully");
  }
}
