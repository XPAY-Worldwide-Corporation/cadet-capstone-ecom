import { Test, TestingModule } from "@nestjs/testing";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { multipleImages, responseHandler } from "src/utils";
import { ROLE } from "src/constants";
import { JwtAuthGuard } from "src/middleware";
import { ENV } from "src/config";

jest.mock("src/utils", () => ({
  multipleImages: jest.fn().mockResolvedValue([
    {
      public_id: "image_id_1",
      url: "http://example.com/image1.jpg",
      originalname: "image1.jpg",
    },
    {
      public_id: "gov_id_1",
      url: "http://example.com/gov1.jpg",
      originalname: "gov1.jpg",
    },
  ]),
  responseHandler: jest.fn(),
}));

describe("CustomersController", () => {
  let controller: CustomersController;
  const mockService = {
    customers: [],
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockImplementation((id: number) => {
      const customer = mockService.customers.find((m) => m.id === id);
      if (!customer) throw new NotFoundException("Customer not found");
      return Promise.resolve(customer);
    }),
    add: jest.fn().mockImplementation((dto: CreateCustomerDto) => {
      const newCustomer = { id: mockService.customers.length + 1, ...dto };
      mockService.customers.push(newCustomer);
      return Promise.resolve(newCustomer);
    }),
    edit: jest.fn().mockImplementation((id: number, dto: UpdateCustomerDto) => {
      const index = mockService.customers.findIndex((m) => m.id === id);
      if (index === -1) throw new NotFoundException("Customer not found");
      mockService.customers[index] = {
        ...mockService.customers[index],
        ...dto,
      };
      return Promise.resolve(mockService.customers[index]);
    }),
    delete: jest.fn().mockImplementation((id: number) => {
      const index = mockService.customers.findIndex((m) => m.id === id);
      if (index === -1) throw new NotFoundException("Customer not found");
      const deletedCustomer = mockService.customers.splice(index, 1)[0];
      return Promise.resolve(deletedCustomer);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        { provide: CustomersService, useValue: mockService },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({ role: ROLE.CUSTOMER }),
          },
        },
        { provide: Reflector, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { role: ROLE.CUSTOMER };
          return true;
        }),
      })
      .compile();

    controller = module.get<CustomersController>(CustomersController);
    mockService.customers = [];
    (multipleImages as jest.Mock).mockClear();
    (responseHandler as jest.Mock).mockClear();
  });

  const createCustomerDto: CreateCustomerDto = {
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
    government_id: [
      {
        public_id: "gov_id_1",
        url: "http://example.com/gov1.jpg",
        originalname: "gov1.jpg",
      },
    ],
    verificationCode: undefined,
  };

  const updateCustomerDto: UpdateCustomerDto = {
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
    government_id: [
      {
        public_id: "gov_id_2",
        url: "http://example.com/gov2.jpg",
        originalname: "gov2.jpg",
      },
    ],
    verificationCode: undefined,
  };

  const mockCustomer = {
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
    government_id: [
      {
        public_id: "gov_id_1",
        url: "http://example.com/gov1.jpg",
        originalname: "gov1.jpg",
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

  it("should create a Customer", async () => {
    const hashedPassword = await bcrypt.hash("password", ENV.SALT_NUMBER);
    const createCustomerDtoWithPassword = {
      ...createCustomerDto,
      password: hashedPassword,
    };

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockCustomer, "Customer created successfully"),
    );

    const files = {
      image: [
        {
          originalname: "image1.jpg",
          mimetype: "image/jpeg",
          size: 1234,
        } as Express.Multer.File,
      ],
      government_id: [
        {
          originalname: "gov1.jpg",
          mimetype: "image/jpeg",
          size: 5678,
        } as Express.Multer.File,
      ],
    };

    const result = await controller.create(
      createCustomerDtoWithPassword,
      files,
    );
    expect(result).toEqual(
      mockResponse(mockCustomer, "Customer created successfully"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should return all customers", async () => {
    mockService.customers.push(mockCustomer);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(
        mockService.customers,
        "All customers retrieved successfully",
      ),
    );

    const result = await controller.findAll();
    expect(result).toEqual(
      mockResponse(
        mockService.customers,
        "All customers retrieved successfully",
      ),
    );
    expect(result).toMatchSnapshot();
  });

  it("should return a single customer", async () => {
    mockService.customers.push(mockCustomer);

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockCustomer, "Customer retrieved successfully"),
    );

    const result = await controller.findOne(1);
    expect(result).toEqual(
      mockResponse(mockCustomer, "Customer retrieved successfully"),
    );
    expect(result).toMatchSnapshot();
  });

  it("should update a Customer's details", async () => {
    await controller.create(createCustomerDto, {
      image: [],
      government_id: [],
    });

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(
        {
          ...mockCustomer,
          ...updateCustomerDto,
        },
        "Customer updated successfully",
      ),
    );

    const files = {
      image: [
        {
          originalname: "image2.jpg",
          mimetype: "image/jpeg",
          size: 1234,
        } as Express.Multer.File,
      ],
      government_id: [
        {
          originalname: "gov2.jpg",
          mimetype: "image/jpeg",
          size: 5678,
        } as Express.Multer.File,
      ],
    };

    const result = await controller.update(1, updateCustomerDto, files);
    expect(result).toEqual(
      mockResponse(
        {
          ...mockCustomer,
          ...updateCustomerDto,
        },
        "Customer updated successfully",
      ),
    );
    expect(result).toMatchSnapshot();
  });

  it("should delete a Customer", async () => {
    await controller.create(createCustomerDto, {
      image: [],
      government_id: [],
    });

    (responseHandler as jest.Mock).mockReturnValue(
      mockResponse(mockCustomer, "Customer deleted successfully"),
    );

    const result = await controller.remove(1);
    expect(result).toEqual(
      mockResponse(mockCustomer, "Customer deleted successfully"),
    );
    expect(result).toMatchSnapshot();
  });
});
