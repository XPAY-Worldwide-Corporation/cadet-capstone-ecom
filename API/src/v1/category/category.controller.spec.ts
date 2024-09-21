import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaConfigService } from 'src/config/config.prisma'; // Adjust the path accordingly
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: PrismaConfigService, // Mocking PrismaConfigService
          useValue: {
            category: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        }
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Electronics' };
      const result = { id: 1, name: 'Electronics' };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCategoryDto)).toEqual({
        status: 201,
        message: 'Category created successfully',
        data: result,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [{ id: 1, name: 'Electronics' }];

      // Mock service method directly
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
  
      expect(await controller.findAll()).toEqual({
        status: 200,
        message: 'All Categories retrieved successfully',
        data: result,
      });
    });
  });  

    it('should return a message if no categories are found', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      expect(await controller.findAll()).toEqual({
        status: 200,
        message: 'No Categories found',
        data: [],
      });
    });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const result = { id: 1, name: 'Electronics' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual({
        status: 200,
        message: 'Category retrieved successfully',
        data: result,
      });
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(
        new NotFoundException('Category with ID 1 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'New Electronics' };
      const result = { id: 1, name: 'New Electronics' };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateCategoryDto)).toEqual({
        status: 200,
        message: 'Category updated successfully',
        data: result,
      });
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'New Electronics' };

      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.update('1', updateCategoryDto)).rejects.toThrow(
        new NotFoundException('Category with ID 1 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const result = { id: 1, name: 'Electronics' };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual({
        status: 200,
        message: 'Category deleted successfully',
        data: result,
      });
    });

    it('should throw a NotFoundException if the category is not found', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(null);

      await expect(controller.remove('1')).rejects.toThrow(
        new NotFoundException('Category with ID 1 not found'),
      );
    });
  });
});
