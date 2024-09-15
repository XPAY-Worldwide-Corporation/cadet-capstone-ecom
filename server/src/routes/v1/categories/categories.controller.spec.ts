import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard } from "src/middleware";
import { ROLE } from "src/constants";

describe("CategoriesController", () => {
  let controller: CategoriesController;

  const mockService = {
    categories: [],
    getAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockService.categories)),
    getById: jest.fn().mockImplementation((id: number) => {
      const category = mockService.categories.find((c) => c.id === id);
      if (!category) {
        throw new NotFoundException("Category not found");
      }
      return Promise.resolve(category);
    }),
    add: jest.fn().mockImplementation((dto: CreateCategoryDto) => {
      const newCategory = { id: mockService.categories.length + 1, ...dto };
      mockService.categories.push(newCategory);
      return Promise.resolve(newCategory);
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateCategoryDto) => {
        const index = mockService.categories.findIndex((c) => c.id === id);
        if (index === -1) {
          throw new NotFoundException("Category not found");
        }
        mockService.categories[index] = {
          ...mockService.categories[index],
          ...dto,
        };
        return Promise.resolve(mockService.categories[index]);
      }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.categories.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new NotFoundException("Category not found");
      }
      const deletedCategory = mockService.categories.splice(index, 1)[0];
      return Promise.resolve(deletedCategory);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockImplementation((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { role: request.headers["role"] || ROLE.CUSTOMER };
          return true;
        }),
      })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    mockService.categories = [];
  });

  const categoryDtos = {
    electronics: { name: "Electronics" } as CreateCategoryDto,
    fashion: { name: "Fashion" } as CreateCategoryDto,
    updateFashion: { name: "Updated Fashion" } as UpdateCategoryDto,
  };

  it("should create a category", async () => {
    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.MERCHANT };
        return true;
      });

    const result = await controller.create(categoryDtos.electronics);
    expect(result).toEqual({
      data: { id: 1, name: "Electronics" },
      message: "Category created successfully",
      meta: {},
      status: true,
    });
    expect(result).toMatchSnapshot();
  });

  it("should return all categories", async () => {
    await controller.create(categoryDtos.electronics);
    await controller.create(categoryDtos.fashion);
    const result = await controller.findAll();
    expect(result).toEqual({
      data: [
        { id: 1, name: "Electronics" },
        { id: 2, name: "Fashion" },
      ],
      message: "All categories retrieved successfully",
      meta: {},
      status: true,
    });
    expect(result).toMatchSnapshot();
  });

  it("should find a category", async () => {
    await controller.create(categoryDtos.electronics);
    const result = await controller.findOne(1);
    expect(result).toEqual({
      data: { id: 1, name: "Electronics" },
      message: "Category retrieved successfully",
      meta: {},
      status: true,
    });
    expect(result).toMatchSnapshot();
  });

  it("should update a category", async () => {
    await controller.create(categoryDtos.fashion);

    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.MERCHANT };
        return true;
      });

    const result = await controller.update(1, categoryDtos.updateFashion);
    expect(result).toEqual({
      data: { id: 1, name: "Updated Fashion" },
      message: "Category updated successfully",
      meta: {},
      status: true,
    });
    expect(result).toMatchSnapshot();
  });

  it("should delete a category", async () => {
    await controller.create(categoryDtos.electronics);

    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.MERCHANT };
        return true;
      });

    const result = await controller.remove(1);
    expect(result).toEqual({
      data: { id: 1, name: "Electronics" },
      message: "Category deleted successfully",
      meta: {},
      status: true,
    });
    expect(result).toMatchSnapshot();
  });
});
