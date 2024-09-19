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
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { responseHandler, multipleImages } from "src/utils";
import { STATUSCODE, PATH, RESOURCE, ROLE } from "src/constants";
import { JwtAuthGuard, Roles } from "src/middleware";
import { UploadImages } from "src/types";

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll() {
    const data = await this.customersService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No customers found"
        : "All customers retrieved successfully",
    );
  }

  @Get(PATH.ID)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.customersService.getById(id);
    return responseHandler(data, "customer retrieved successfully");
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "image" }, { name: "government_id" }]),
  )
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      government_id?: Express.Multer.File[];
    },
  ) {
    const uploadedImages = await multipleImages(files.image || [], []);
    const uploadedGovIds = await multipleImages(files.government_id || [], []);

    if (uploadedImages.length === STATUSCODE.ZERO) {
      throw new BadRequestException("At least one image is required.");
    }

    const data = await this.customersService.add({
      ...createCustomerDto,
      image: uploadedImages,
      government_id: uploadedGovIds,
    });

    return responseHandler(data, "Customer created successfully");
  }

  @Patch(PATH.EDIT)
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.CUSTOMER)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "image" }, { name: "government_id" }]),
  )
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      government_id?: Express.Multer.File[];
    },
  ) {
    const oldData = await this.customersService.getById(id);

    const oldImages =
      typeof oldData.image === "string"
        ? JSON.parse(oldData.image)
        : oldData.image || [];

    const uploadNewImages = files.image?.length
      ? await multipleImages(
          files.image,
          oldImages.map((image: UploadImages) => image.public_id),
        )
      : oldImages;

    const oldGovId =
      typeof oldData.government_id === "string"
        ? JSON.parse(oldData.government_id)
        : oldData.government_id || [];

    const uploadNewGovIds = files.government_id?.length
      ? await multipleImages(
          files.government_id,
          oldGovId.map((govId: UploadImages) => govId.public_id),
        )
      : oldGovId;

    const data = await this.customersService.edit(id, {
      ...updateCustomerDto,
      image: uploadNewImages,
      government_id: uploadNewGovIds,
    });

    return responseHandler(data, "Customer updated successfully");
  }

  @Delete(PATH.DELETE)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.customersService.delete(id);

    const images =
      typeof data.image === "string"
        ? JSON.parse(data.image)
        : data.image || [];

    if (images?.length > 0) {
      const publicIds = images.map((image: UploadImages) => image.public_id);
      await multipleImages([], publicIds);
    }

    const govIds =
      typeof data.government_id === "string"
        ? JSON.parse(data.government_id)
        : data.government_id || [];

    if (govIds?.length > 0) {
      const govPublicIds = govIds.map((govId: UploadImages) => govId.public_id);
      await multipleImages([], govPublicIds);
    }

    return responseHandler(data, "Customer deleted successfully");
  }
}
