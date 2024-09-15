import { Test, TestingModule } from "@nestjs/testing";
import { InventoryController } from "./inventories.controller";
import { InventoryService } from "./inventories.service";
import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { UpdateInventoryDto } from "./dto/update-inventory.dto";
import { NotFoundException } from "@nestjs/common";
import { JwtAuthGuard } from "src/middleware";
import { ROLE } from "src/constants";

describe("InventoryController", () => {
  let controller: InventoryController;

  const mockService = {
    inventories: [],
    getAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockService.inventories)),
    getById: jest.fn().mockImplementation((id: number) => {
      const inventory = mockService.inventories.find((i) => i.id === id);
      if (!inventory) {
        throw new NotFoundException("Inventory not found");
      }
      return Promise.resolve(inventory);
    }),
    add: jest.fn().mockImplementation((dto: CreateInventoryDto) => {
      const newInventory = { id: mockService.inventories.length + 1, ...dto };
      mockService.inventories.push(newInventory);
      return Promise.resolve(newInventory);
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateInventoryDto) => {
        const index = mockService.inventories.findIndex((i) => i.id === id);
        if (index === -1) {
          throw new NotFoundException("Inventory not found");
        }
        mockService.inventories[index] = {
          ...mockService.inventories[index],
          ...dto,
        };
        return Promise.resolve(mockService.inventories[index]);
      }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.inventories.findIndex((i) => i.id === id);
      if (index === -1) {
        throw new NotFoundException("Inventory not found");
      }
      const deletedInventory = mockService.inventories.splice(index, 1)[0];
      return Promise.resolve(deletedInventory);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [{ provide: InventoryService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockImplementation((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { role: request.headers["role"] || ROLE.MERCHANT };
          return true;
        }),
      })
      .compile();

    controller = module.get<InventoryController>(InventoryController);
    mockService.inventories = [];
  });

  const inventoryDtos = {
    inventory1: { stock: "100", productId: 1 } as CreateInventoryDto,
    updateInventory: { stock: "150", productId: 1 } as UpdateInventoryDto,
  };

  it("should create an inventory", async () => {
    const result = await controller.create(inventoryDtos.inventory1);
    expect(result).toMatchSnapshot();
  });

  it("should return all inventories", async () => {
    await controller.create(inventoryDtos.inventory1);
    const result = await controller.findAll();
    expect(result).toMatchSnapshot();
  });

  it("should find an inventory", async () => {
    await controller.create(inventoryDtos.inventory1);
    const result = await controller.findOne(1);
    expect(result).toMatchSnapshot();
  });

  it("should update an inventory", async () => {
    await controller.create(inventoryDtos.inventory1);
    const result = await controller.update(1, inventoryDtos.updateInventory);
    expect(result).toMatchSnapshot();
  });

  it("should delete an inventory", async () => {
    await controller.create(inventoryDtos.inventory1);
    const result = await controller.remove(1);
    expect(result).toMatchSnapshot();
  });
});
