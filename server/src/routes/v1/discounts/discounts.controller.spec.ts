import { Test, TestingModule } from "@nestjs/testing";
import { DiscountsController } from "./discounts.controller";
import { DiscountsService } from "./discounts.service";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { NotFoundException } from "@nestjs/common";
import { JwtAuthGuard } from "src/middleware";
import { ROLE } from "src/constants";

describe("DiscountsController", () => {
  let controller: DiscountsController;

  const mockService = {
    discounts: [],
    getAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockService.discounts)),
    getById: jest.fn().mockImplementation((id: number) => {
      const discount = mockService.discounts.find((d) => d.id === id);
      if (!discount) {
        throw new NotFoundException("Discount not found");
      }
      return Promise.resolve(discount);
    }),
    add: jest.fn().mockImplementation((dto: CreateDiscountDto) => {
      const newDiscount = {
        id: mockService.discounts.length + 1,
        isAccepted: false,
        ...dto,
      };
      mockService.discounts.push(newDiscount);
      return Promise.resolve(newDiscount);
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateDiscountDto) => {
        const index = mockService.discounts.findIndex((d) => d.id === id);
        if (index === -1) {
          throw new NotFoundException("Discount not found");
        }
        mockService.discounts[index] = {
          ...mockService.discounts[index],
          ...dto,
        };
        return Promise.resolve(mockService.discounts[index]);
      }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.discounts.findIndex((d) => d.id === id);
      if (index === -1) {
        throw new NotFoundException("Discount not found");
      }
      const deletedDiscount = mockService.discounts.splice(index, 1)[0];
      return Promise.resolve(deletedDiscount);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountsController],
      providers: [{ provide: DiscountsService, useValue: mockService }],
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

    controller = module.get<DiscountsController>(DiscountsController);
    mockService.discounts = [];
  });

  const discountDtos = {
    discount1: { customerId: 1 } as CreateDiscountDto,
    updateDiscount: { isAccepted: true } as UpdateDiscountDto,
  };

  it("should create a discount", async () => {
    const result = await controller.create(discountDtos.discount1);
    expect(result).toMatchSnapshot();
  });

  it("should return all discounts", async () => {
    await controller.create(discountDtos.discount1);
    const result = await controller.findAll();
    expect(result).toMatchSnapshot();
  });

  it("should find a discount", async () => {
    await controller.create(discountDtos.discount1);
    const result = await controller.findOne(1);
    expect(result).toMatchSnapshot();
  });

  it("should update a discount", async () => {
    await controller.create(discountDtos.discount1);
    const result = await controller.update(1, discountDtos.updateDiscount);
    expect(result).toMatchSnapshot();
  });

  it("should delete a discount", async () => {
    await controller.create(discountDtos.discount1);
    const result = await controller.remove(1);
    expect(result).toMatchSnapshot();
  });
});
