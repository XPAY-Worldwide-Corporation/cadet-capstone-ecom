import { Body, Controller, Delete, FileTypeValidator, Get, Param, ParseFilePipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {v4} from 'uuid'
import { AuthenticationGuard } from '../auth/guard/authentication-guard'
import { CreateProductDto } from './dto/createproduct-dto';
import { UpdateProductDto } from './dto/updateproduct-dto';
import { uploadImage } from '../utils/file'

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService:ProductsService){}

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthenticationGuard)
    async upload_image(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|JPG)' })
            ]
        })
    ) file: Express.Multer.File){
        return await uploadImage(file, '/xpayecommerce/products/')
    }

    @Post()
    @UseGuards(AuthenticationGuard)
    async create_product(@Body() data:CreateProductDto){
        return await this.productsService.create_product(data)
    }

    @Get('/search/:name')
    async search_products(@Param('name') name: string){
        return await this.productsService.search_products(name)
    }

    @Get('/store-products/:id')
    async fetch_store_products(@Param('id') id: number){
        return await this.productsService.fetch_products({store_id:id})
    }

    @Get()
    async fetch_products(){
        return await this.productsService.fetch_products({})
    }

    @Get(':id')
    async fetch_product(@Param() id: number){
        return await this.productsService.fetch_product(id)
    }

    @Patch(':id')
    @UseGuards(AuthenticationGuard)
    async update_product(@Param('id') id: number, @Body() data:UpdateProductDto){
        delete data.id
        return await this.productsService.update_product(id, data)
    }

    @Delete(':id')
    @UseGuards(AuthenticationGuard)
    async delete_product(@Param('id') id: number){
        return await this.productsService.delete_product(id)
    }
}
