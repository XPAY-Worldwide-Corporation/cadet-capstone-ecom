import { Test, TestingModule } from "@nestjs/testing";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { NotFoundException } from "@nestjs/common";

describe("RolesController", () => {
  let controller: RolesController;

  const mockService = {
    roles: [],
    getAll: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockService.roles)),
    getById: jest.fn().mockImplementation((id: number) => {
      const role = mockService.roles.find((r) => r.id === id);
      if (!role) {
        throw new NotFoundException("Role not found");
      }
      return Promise.resolve(role);
    }),
    add: jest.fn().mockImplementation((dto: CreateRoleDto) => {
      const newRole = { id: mockService.roles.length + 1, ...dto };
      mockService.roles.push(newRole);
      return Promise.resolve(newRole);
    }),
    update: jest.fn().mockImplementation((id: number, dto: UpdateRoleDto) => {
      const index = mockService.roles.findIndex((r) => r.id === id);
      if (index === -1) {
        throw new NotFoundException("Role not found");
      }
      mockService.roles[index] = { ...mockService.roles[index], ...dto };
      return Promise.resolve(mockService.roles[index]);
    }),
    deleteById: jest.fn().mockImplementation((id: number) => {
      const index = mockService.roles.findIndex((r) => r.id === id);
      if (index === -1) {
        throw new NotFoundException("Role not found");
      }
      const deletedRole = mockService.roles.splice(index, 1)[0];
      return Promise.resolve(deletedRole);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockService }],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    mockService.roles = [];
  });

  const roleDtos = {
    customer: { roleName: "Customer" } as CreateRoleDto,
    merchant: { roleName: "Merchant" } as CreateRoleDto,
    updateCustomer: { roleName: "Customer" } as UpdateRoleDto,
  };

  it("should create a Customer role", async () => {
    const result = await controller.create(roleDtos.customer);
    expect(result).toMatchSnapshot();
  });

  it("should create a Merchant role", async () => {
    await controller.create(roleDtos.customer);
    const result = await controller.create(roleDtos.merchant);
    expect(result).toMatchSnapshot();
  });

  it("should return all roles", async () => {
    await controller.create(roleDtos.customer);
    await controller.create(roleDtos.merchant);
    const result = await controller.findAll();
    expect(result).toMatchSnapshot();
  });

  it("should find a Customer role", async () => {
    await controller.create(roleDtos.customer);
    const result = await controller.findOne(1);
    expect(result).toMatchSnapshot();
  });

  it("should update Customer role", async () => {
    await controller.create(roleDtos.customer);
    const result = await controller.update(1, roleDtos.updateCustomer);
    expect(result).toMatchSnapshot();
  });

  it("should delete the Customer role", async () => {
    await controller.create(roleDtos.customer);
    const result = await controller.remove(1);
    expect(result).toMatchSnapshot();
  });
});
