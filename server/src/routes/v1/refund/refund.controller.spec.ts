import { Test, TestingModule } from "@nestjs/testing";
import { RefundController } from "./refund.controller";
import { RefundService } from "./refund.service";
import { CreateRefundDto } from "./dto/create-refund.dto";
import { UpdateRefundDto } from "./dto/update-refund.dto";
import { NotFoundException } from "@nestjs/common";
import { JwtAuthGuard } from "src/middleware";
import { ROLE } from "src/constants";

describe("RefundController", () => {
  let controller: RefundController;

  const mockService = {
    refunds: [],
    getAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockService.refunds)),
    getById: jest.fn().mockImplementation((id: number) => {
      const refund = mockService.refunds.find((r) => r.id === id);
      if (!refund) {
        throw new NotFoundException("Refund not found");
      }
      return Promise.resolve(refund);
    }),
    add: jest.fn().mockImplementation((dto: CreateRefundDto) => {
      const newRefund = { id: mockService.refunds.length + 1, ...dto };
      mockService.refunds.push(newRefund);
      return Promise.resolve(newRefund);
    }),
    update: jest.fn().mockImplementation((id: number, dto: UpdateRefundDto) => {
      const index = mockService.refunds.findIndex((r) => r.id === id);
      if (index === -1) {
        throw new NotFoundException("Refund not found");
      }
      mockService.refunds[index] = { ...mockService.refunds[index], ...dto };
      return Promise.resolve(mockService.refunds[index]);
    }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.refunds.findIndex((r) => r.id === id);
      if (index === -1) {
        throw new NotFoundException("Refund not found");
      }
      const deletedRefund = mockService.refunds.splice(index, 1)[0];
      return Promise.resolve(deletedRefund);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundController],
      providers: [{ provide: RefundService, useValue: mockService }],
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

    controller = module.get<RefundController>(RefundController);
    mockService.refunds = [];
  });

  const refundDtos = {
    createRefund: {
      reason: "Defective product",
      transactionId: 1,
    } as CreateRefundDto,
    updateRefund: {
      isRefund: true,
      reason: "Changed reason",
      transactionId: 2,
    } as UpdateRefundDto,
  };

  it("should create a refund", async () => {
    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.CUSTOMER };
        return true;
      });

    const result = await controller.create(refundDtos.createRefund);
    expect(result).toMatchSnapshot();
  });

  it("should return all refunds", async () => {
    await controller.create(refundDtos.createRefund);
    const result = await controller.findAll();
    expect(result).toMatchSnapshot();
  });

  it("should find a refund", async () => {
    await controller.create(refundDtos.createRefund);
    const result = await controller.findOne(1);
    expect(result).toMatchSnapshot();
  });

  it("should update a refund", async () => {
    await controller.create(refundDtos.createRefund);

    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.MERCHANT };
        return true;
      });

    const result = await controller.update(1, refundDtos.updateRefund);
    expect(result).toMatchSnapshot();
  });

  it("should delete a refund", async () => {
    await controller.create(refundDtos.createRefund);

    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.MERCHANT };
        return true;
      });

    const result = await controller.remove(1);
    expect(result).toMatchSnapshot();
  });
});
