import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaConfigService } from 'src/config/config.prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly saltRounds = 10; // Number of salt rounds for bcrypt

  constructor(private readonly prisma: PrismaConfigService) {}

  async create(createUserDto: CreateUserDto) {
    const { image, role_name, password, ...userData } = createUserDto;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create the User
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        role_name: role_name,
        image: JSON.stringify(image), // Save images as JSON
        password: hashedPassword, // Save hashed password
      },
    });

    // Create corresponding Merchant or Customer based on the role
    if (role_name === 'Merchant') {
      await this.prisma.merchant.create({
        data: {
          userId: user.id,
        },
      });
    } else if (role_name === 'Customer') {
      await this.prisma.customer.create({
        data: {
          userId: user.id,
        },
      });
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        merchant: true,
        customer: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        merchant: true,
        customer: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { image, role_name, password, ...userData } = updateUserDto;

    const updateData: any = {
      ...userData,
      image: image ? JSON.stringify(image) : undefined, // Only update if image is provided
    };

    if (password) {
      // Hash the new password
      updateData.password = await bcrypt.hash(password, this.saltRounds);
    }

    // Update the User
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Update or create Merchant or Customer based on the role
    if (role_name === 'Merchant') {
      await this.prisma.merchant.upsert({
        where: { userId: id },
        update: {}, // Add fields to update if needed
        create: {
          userId: id,
        },
      });
    } else if (role_name === 'Customer') {
      await this.prisma.customer.upsert({
        where: { userId: id },
        update: {}, // Add fields to update if needed
        create: {
          userId: id,
        },
      });
    }

    return user;
  }

  async remove(id: number) {
    // Delete related merchant/customer records before deleting the user
    await this.prisma.merchant.deleteMany({
      where: { userId: id },
    });
    await this.prisma.customer.deleteMany({
      where: { userId: id },
    });

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
