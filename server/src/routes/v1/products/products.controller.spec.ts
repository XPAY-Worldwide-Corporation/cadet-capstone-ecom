import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { NotFoundException } from "@nestjs/common";
import { multipleImages, responseHandler } from "src/utils";
import { ROLE } from "src/constants";
import { JwtAuthGuard } from "src/middleware";

jest.mock("src/utils", () => ({
  multipleImages: jest.fn().mockResolvedValue([
    {
      public_id: "image_id_1",
      url: "http://example.com/image1.jpg",
      originalname: "image1.jpg",
    },
  ]),
  responseHandler: jest.fn(),
}));

describe("ProductsController", () => {
  let controller: ProductsController;

  const mockService = {
    products: [],
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockImplementation((id: number) => {
      const product = mockService.products.find((p) => p.id === id);
      if (!product) throw new NotFoundException("Product not found");
      return Promise.resolve(product);
    }),
    add: jest.fn().mockImplementation((dto: CreateProductDto) => {
      const newProduct = { id: mockService.products.length + 1, ...dto };
      mockService.products.push(newProduct);
      return Promise.resolve(newProduct);
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateProductDto) => {
        const index = mockService.products.findIndex((p) => p.id === id);
        if (index === -1) throw new NotFoundException("Product not found");
        mockService.products[index] = {
          ...mockService.products[index],
          ...dto,
        };
        return Promise.resolve(mockService.products[index]);
      }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.products.findIndex((p) => p.id === id);
      if (index === -1) throw new NotFoundException("Product not found");
      const deletedProduct = mockService.products.splice(index, 1)[0];
      return Promise.resolve(deletedProduct);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockService },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({ role: ROLE.MERCHANT }),
          },
        },
        { provide: Reflector, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { role: request.headers["role"] || ROLE.CUSTOMER };
          return true;
        }),
      })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    mockService.products = [];
    (multipleImages as jest.Mock).mockClear();
    (responseHandler as jest.Mock).mockClear();
  });

  const createProductDto: CreateProductDto = {
    product_name: "Sample Product",
    isNew: true,
    price: 19.99,
    image: [
      {
        public_id: "image_id_1",
        url: "http://example.com/image1.jpg",
        originalname: "image1.jpg",
      },
    ],
    categoryId: 1,
    merchantId: 1,
  };

  const updateProductDto: UpdateProductDto = {
    product_name: "Updated Product",
    isNew: false,
    price: 29.99,
    image: [
      {
        public_id: "image_id_2",
        url: "http://example.com/image2.jpg",
        originalname: "image2.jpg",
      },
    ],
    categoryId: 2,
    merchantId: 2,
  };

  const mockProduct = {
    id: 1,
    product_name: "Sample Product",
    isNew: true,
    price: 19.99,
    image: [
      {
        public_id: "image_id_1",
        url: "http://example.com/image1.jpg",
        originalname: "image1.jpg",
      },
    ],
    categoryId: 1,
    merchantId: 1,
  };

  const mockResponse = (data: any, message: string) => ({
    data,
    message,
    meta: {},
    status: true,
  });

  it("should create a Product", async () => {
    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockProduct, "Product created successfully"),
    );

    const files = [
      {
        originalname: "image1.jpg",
        mimetype: "image/jpeg",
        size: 1234,
      } as Express.Multer.File,
    ];

    const result = await controller.create(createProductDto, files);
    expect(result).toMatchSnapshot();
  });

  it("should return all products", async () => {
    mockService.products.push(mockProduct);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockService.products, "All products retrieved successfully"),
    );

    const result = await controller.findAll();
    expect(result).toMatchSnapshot();
  });

  it("should return a single product", async () => {
    mockService.products.push(mockProduct);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockProduct, "Product retrieved successfully"),
    );

    const result = await controller.findOne(1);
    expect(result).toMatchSnapshot();
  });

  it("should update a Product's details", async () => {
    await controller.create(createProductDto, []);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(
        {
          ...mockProduct,
          ...updateProductDto,
        },
        "Product updated successfully",
      ),
    );

    const files = [
      {
        originalname: "image2.jpg",
        mimetype: "image/jpeg",
        size: 1234,
      } as Express.Multer.File,
    ];

    const result = await controller.update(1, updateProductDto, files);
    expect(result).toMatchSnapshot();
  });

  it("should delete a Product", async () => {
    await controller.create(createProductDto, []);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockProduct, "Product deleted successfully"),
    );

    const result = await controller.remove(1);
    expect(result).toMatchSnapshot();
  });
});
