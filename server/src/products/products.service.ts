import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prismaService : PrismaService) {}

  async findAllProducts(storeId : number, catId : number, storeCatI: number) {
    return await this.prismaService.product.findMany({
      include: {
        prodVariations: {
          include: {
            prodInventory: true
          }
        }
      }
    });
  }

  async findProductById(id: number) {
    return await this.prismaService.product.findUnique({
      where: { id: id }, 
      include: {
        prodVariations: {
          include: {
            prodInventory: true
          }
        }
      }
    });
  }

  async createNewProduct(createProductDto: CreateProductDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const newProd = await tx.product.create({
        data: {
          storeId: 1,
          prodName: createProductDto.prodName,
          prodDesc: createProductDto.prodDesc,
          categoryId: createProductDto.categoryId,
          storeCategoryId: createProductDto.storeCategoryId,
          pricePerUnit: createProductDto.pricePerUnit,
        }
      });

      const addProdVars = createProductDto.prodVar.map(async (p) => {
        const prod = await tx.productVariation.create({ 
          data: {
            productId: newProd.id,
            prodHeight: p.prodHeight,
            prodWidth: p.prodWidth,
            color: p.color,
            size: p.size
          } 
        });
        
        await tx.inventory.create({ 
          data: {
            productVarId: prod.id,
            stockNo: p.stockNo
          }
        }); 

      });

      await Promise.all(addProdVars);
    });
  }

  async updateAProduct(id: number, updateProductDto: UpdateProductDto) {
    return await this.prismaService.product.update({
      where: { id: id }, 
      data: updateProductDto
    })
  }

  async deleteAProduct(id: number) {
    return await this.prismaService.product.delete({
      where: { id : id }
    });
  }
}
