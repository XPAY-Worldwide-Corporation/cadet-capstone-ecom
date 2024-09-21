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
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { responseHandler } from 'src/utils/utils.responseHandler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multipleImages } from 'src/utils/utils.cloudinary';
import { JwtAuthGuard } from '../auth/auth.guard';
import { roles } from '../auth/roles.decorator';

@Controller('review')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @roles( 'Customer')
  @UseInterceptors(FilesInterceptor('image', 10)) // Handle up to 10 image files
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length === 0)
      throw new BadRequestException('At least one image is required.');

    const data = await this.reviewService.create({
      ...createReviewDto,
      image: uploadedImages,
    });

    return responseHandler(
      data,
      'Review created successfully',
      HttpStatus.CREATED,
    );
  }


  @Get()
  @roles('Merchant', 'Customer')
  async findAll() {
    const data = await this.reviewService.findAll();
    return responseHandler(
      data,
      data?.length === 0
        ? 'No reviews found'
        : 'All reviews retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @roles('Merchant', )
  async findOne(@Param('id') id: string) {
    const data = await this.reviewService.findOne(+id);
    if (!data) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Review retrieved successfully',
      HttpStatus.OK,
    );
  }


  @Patch('edit/:id')
  @roles( 'Customer')
  @UseInterceptors(FilesInterceptor('image', 10)) // Handle up to 10 image files
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length > 0) {
      updateReviewDto.image = uploadedImages;
    }

    const data = await this.reviewService.update(+id, updateReviewDto);

    if (!data) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return responseHandler(data, 'Review updated successfully', HttpStatus.OK);
  }

  // Delete a review
  @Delete('delete/:id')
  @roles( 'Customer')
  async remove(@Param('id') id: string) {
    const data = await this.reviewService.remove(+id);
    if (!data) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return responseHandler(data, 'Review deleted successfully', HttpStatus.OK);
  }
}
