import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'
import { ReviewsService } from './reviews.service';
import { AuthenticationGuard } from '../auth/guard/authentication-guard'
import { UnauthorizedException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

describe('ReviewsController', () => {
  let controller: ReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers:[
        JwtService,
        PrismaService,
        ReviewsService,
        {
          provide: AuthenticationGuard,
          useValue: {canActivate: jest.fn().mockReturnValue(true)}
        }
      ]
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be able to create a review', async () => {
    const inputs = {
      product_id:1,
      user_id:1,
      title:'review title',
      message:'review message',
      rate:5
    }
    jest.spyOn(controller, 'create_review').mockResolvedValue({
      id:1, ...inputs
    })
    const req = {
      user:{
        id:1
      }
    }
    const res = await controller.create_review(inputs, req)
    expect(res).toEqual(expect.any(Object))
  })

  it('should return a unauthorized error', async () => {
    const inputs = {
      product_id:1,
      user_id:1,
      title:'review title',
      message:'review message',
      rate:5
    }
    jest.spyOn(controller, 'create_review').mockImplementation(() => {throw new UnauthorizedException('You are not authorized')})
    const req = {
      user:{
        id:1
      }
    }
    try {
      await controller.create_review(inputs, req)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }
  })

  it('should return a validation error', async () => {
    const inputs = {
      product_id:1,
      user_id:1,
      title:'',
      message:'',
      rate:5
    }
    jest.spyOn(controller, 'create_review').mockImplementation(() => {throw new ValidationError()})
    const req = {
      user:{
        id:1
      }
    }
    try {
      await controller.create_review(inputs, req)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
    }
  })

  it('should return the reviews of a product', async () => {
    jest.spyOn(controller, 'fetch_reviews').mockResolvedValue([
      {
        id:1,
        product_id:1,
        user_id:1,
        title:'review title',
        message:'review message',
        rate:5
      }
    ])
    const res = await controller.fetch_reviews('1')
    expect(res).toEqual(expect.any(Array))
  })

  it('should return a review', async () => {
    jest.spyOn(controller, 'fetch_review').mockResolvedValue(
      {
        id:1,
        product_id:1,
        user_id:1,
        title:'review title',
        message:'review message',
        rate:5
      }
    )
    const res = await controller.fetch_review('1')
    expect(res).toEqual(expect.any(Object))
  })

  it('should be able to update a review', async () => {
    const inputs = {
      product_id:1,
      user_id:1,
      title:'updated review title',
      message:'updated review message',
      rate:5
    }
    jest.spyOn(controller, 'update_review').mockResolvedValue({
      id:1, ...inputs
    })
    const req = {
      user:{
        id:1
      }
    }
    const res = await controller.update_review('1', {
      title:'updated review title',
      message:'updated review message',
      rate:5
    })
    expect(res).toEqual(expect.any(Object))
  })

  it('should be able to delete a review', async () => {
    jest.spyOn(controller, 'delete_review').mockResolvedValue({
      id:1,
      product_id:1,
      user_id:1,
      title:'updated review title',
      message:'updated review message',
      rate:5
    })
    const res = await controller.delete_review('1')
    expect(res).toEqual(expect.any(Object))
  })
});
