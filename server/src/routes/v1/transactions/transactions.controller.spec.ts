import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { NotFoundException } from "@nestjs/common";
import { JwtAuthGuard } from "src/middleware";
import { ROLE } from "src/constants";

describe("TransactionsController", () => {
  let controller: TransactionsController;

  const mockService = {
    transactions: [],
    getAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockService.transactions)),
    getById: jest.fn().mockImplementation((id: number) => {
      const transaction = mockService.transactions.find((t) => t.id === id);
      if (!transaction) {
        throw new NotFoundException("Transaction not found");
      }
      return Promise.resolve(transaction);
    }),
    add: jest.fn().mockImplementation((dto: CreateTransactionDto) => {
      const newTransaction = {
        id: mockService.transactions.length + 1,
        ...dto,
        productTotal: dto.productTotal,
      };
      mockService.transactions.push(newTransaction);
      return Promise.resolve(newTransaction);
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateTransactionDto) => {
        const index = mockService.transactions.findIndex((t) => t.id === id);
        if (index === -1) {
          throw new NotFoundException("Transaction not found");
        }
        mockService.transactions[index] = {
          ...mockService.transactions[index],
          ...dto,
        };
        return Promise.resolve(mockService.transactions[index]);
      }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.transactions.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new NotFoundException("Transaction not found");
      }
      const deletedTransaction = mockService.transactions.splice(index, 1)[0];
      return Promise.resolve(deletedTransaction);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: TransactionsService, useValue: mockService }],
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

    controller = module.get<TransactionsController>(TransactionsController);
    mockService.transactions = [];
  });

  const transactionDtos = {
    createTransaction: {
      payment: "Credit Card",
      productTotal: 100,
      productIds: [1, 2],
      customerId: 1,
    } as CreateTransactionDto,
    updateTransaction: {
      payment: "Debit Card",
      status: "Completed",
    } as UpdateTransactionDto,
  };

  it("should create a transaction", async () => {
    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.CUSTOMER };
        return true;
      });

    const result = await controller.create(transactionDtos.createTransaction);
    expect(result).toMatchSnapshot();
  });

  it("should return all transactions", async () => {
    await controller.create(transactionDtos.createTransaction);
    const result = await controller.findAll();
    expect(result).toMatchSnapshot();
  });

  it("should find a transaction", async () => {
    await controller.create(transactionDtos.createTransaction);
    const result = await controller.findOne(1);
    expect(result).toMatchSnapshot();
  });

  it("should update a transaction", async () => {
    await controller.create(transactionDtos.createTransaction);

    jest
      .spyOn(JwtAuthGuard.prototype, "canActivate")
      .mockImplementation((context) => {
        const request = context.switchToHttp().getRequest();
        request.user = { role: ROLE.CUSTOMER };
        return true;
      });

    const result = await controller.update(
      1,
      transactionDtos.updateTransaction,
    );
    expect(result).toMatchSnapshot();
  });

  it("should delete a transaction", async () => {
    await controller.create(transactionDtos.createTransaction);

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
