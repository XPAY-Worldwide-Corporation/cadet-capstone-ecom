import { Test, TestingModule } from "@nestjs/testing";
import { MerchantsController } from "./merchants.controller";
import { MerchantsService } from "./merchants.service";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { CreateMerchantDto } from "./dto/create-merchant.dto";
import { UpdateMerchantDto } from "./dto/update-merchant.dto";
import { NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtAuthGuard } from "src/middleware";
import { ROLE } from "src/constants";
import { multipleImages, responseHandler } from "src/utils";
import { ENV } from "src/config";

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

describe("MerchantsController", () => {
  let controller: MerchantsController;
  const mockService = {
    merchants: [],
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockImplementation((id: number) => {
      const merchant = mockService.merchants.find((m) => m.id === id);
      if (!merchant) throw new NotFoundException("Merchant not found");
      return Promise.resolve(merchant);
    }),
    add: jest.fn().mockImplementation((dto: CreateMerchantDto) => {
      const newMerchant = { id: mockService.merchants.length + 1, ...dto };
      mockService.merchants.push(newMerchant);
      return Promise.resolve(newMerchant);
    }),
    edit: jest.fn().mockImplementation((id: number, dto: UpdateMerchantDto) => {
      const index = mockService.merchants.findIndex((m) => m.id === id);
      if (index === -1) throw new NotFoundException("Merchant not found");
      mockService.merchants[index] = {
        ...mockService.merchants[index],
        ...dto,
      };
      return Promise.resolve(mockService.merchants[index]);
    }),
    delete: jest.fn().mockImplementation((id: number) => {
      const index = mockService.merchants.findIndex((m) => m.id === id);
      if (index === -1) throw new NotFoundException("Merchant not found");
      const deletedMerchant = mockService.merchants.splice(index, 1)[0];
      return Promise.resolve(deletedMerchant);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantsController],
      providers: [
        { provide: MerchantsService, useValue: mockService },
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
          request.user = { role: ROLE.MERCHANT };
          return true;
        }),
      })
      .compile();

    controller = module.get<MerchantsController>(MerchantsController);
    mockService.merchants = [];
    (multipleImages as jest.Mock).mockClear();
    (responseHandler as jest.Mock).mockClear();
  });

  const createMerchantDto: CreateMerchantDto = {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    password: "",
    address: "123 Main St",
    roleId: 1,
    image: [
      {
        public_id: "image_id_1",
        url: "http://example.com/image1.jpg",
        originalname: "image1.jpg",
      },
    ],
    verificationCode: undefined,
  };

  const updateMerchantDto: UpdateMerchantDto = {
    first_name: "John",
    last_name: "Smith",
    email: "johnsmith@example.com",
    address: "789 Pine St",
    roleId: 1,
    image: [
      {
        public_id: "image_id_2",
        url: "http://example.com/image2.jpg",
        originalname: "image2.jpg",
      },
    ],
    verificationCode: undefined,
  };

  const mockMerchant = {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    address: "123 Main St",
    roleId: 1,
    image: [
      {
        public_id: "image_id_1",
        url: "http://example.com/image1.jpg",
        originalname: "image1.jpg",
      },
    ],
    verificationCode: undefined,
  };

  const mockResponse = (data: any, message: string) => ({
    data,
    message,
    meta: {},
    status: true,
  });

  it("should create a Merchant", async () => {
    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockMerchant, "Merchant created successfully"),
    );

    const hashedPassword = await bcrypt.hash("password", ENV.SALT_NUMBER);
    const createMerchantDtoWithPassword = {
      ...createMerchantDto,
      password: hashedPassword,
    };

    const files: any[] = [
      {
        originalname: "image1.jpg",
        mimetype: "image/jpeg",
        size: 1234,
      },
    ];

    const result = await controller.create(
      createMerchantDtoWithPassword,
      files,
    );
    expect(result).toEqual(
      mockResponse(mockMerchant, "Merchant created successfully"),
    );
  });

  it("should return all merchants", async () => {
    mockService.merchants.push(mockMerchant);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(
        mockService.merchants,
        "All merchants retrieved successfully",
      ),
    );

    const result = await controller.findAll();
    expect(result).toEqual(
      mockResponse(
        mockService.merchants,
        "All merchants retrieved successfully",
      ),
    );
  });

  it("should return a single merchant", async () => {
    mockService.merchants.push(mockMerchant);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockMerchant, "Merchant retrieved successfully"),
    );

    const result = await controller.findOne(1);
    expect(result).toEqual(
      mockResponse(mockMerchant, "Merchant retrieved successfully"),
    );
  });

  it("should update a Merchant's details", async () => {
    await controller.create(createMerchantDto, []);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(
        {
          ...mockMerchant,
          ...updateMerchantDto,
        },
        "Merchant updated successfully",
      ),
    );

    const result = await controller.update(1, updateMerchantDto, []);
    expect(result).toEqual(
      mockResponse(
        {
          ...mockMerchant,
          ...updateMerchantDto,
        },
        "Merchant updated successfully",
      ),
    );
  });

  it("should delete a Merchant", async () => {
    await controller.create(createMerchantDto, []);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockMerchant, "Merchant deleted successfully"),
    );

    const result = await controller.remove(1);
    expect(result).toEqual(
      mockResponse(mockMerchant, "Merchant deleted successfully"),
    );
  });
});
