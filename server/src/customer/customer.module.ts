import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { AddressesModule } from './addresses/addresses.module';
import { ProfileModule } from './profile/profile.module';
import { RouterModule, Routes } from '@nestjs/core';

const routes : Routes = [
  {
    path: 'addresses',
    module: AddressesModule
  },
  {
    path: 'profile',
    module: ProfileModule
  }
]

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [AddressesModule, ProfileModule, RouterModule.register(routes)],
})
export class CustomerModule {}
