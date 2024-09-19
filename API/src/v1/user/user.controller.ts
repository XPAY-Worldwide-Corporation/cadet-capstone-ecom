import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { responseHandler } from 'src/utils/utils.responseHandler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multipleImages } from 'src/utils/utils.cloudinary';
import { JwtAuthGuard } from '../auth/auth.guard';
import { roles } from '../auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image', 10)) // Handle up to 10 image files
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length === 0)
      throw new BadRequestException('At least one image is required.');

    const data = await this.userService.create({
      ...createUserDto,
      image: uploadedImages,
    });

    return responseHandler(
      data,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return responseHandler(
      data,
      data?.length === 0
        ? 'No users found'
        : 'All users retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.findOne(id);
    if (!data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return responseHandler(data, 'User retrieved successfully', HttpStatus.OK);
  }

  @Patch('edit/:id')
  @UseInterceptors(FilesInterceptor('image', 10)) // Handle up to 10 image files
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length > 0) {
      updateUserDto.image = uploadedImages;
    }

    const data = await this.userService.update(id, updateUserDto);

    if (!data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return responseHandler(data, 'User updated successfully', HttpStatus.OK);
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.userService.remove(id);
    if (!data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return responseHandler(data, 'User deleted successfully', HttpStatus.OK);
  }
}
