import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  comment: string;

  @Column('int')
  rating: number;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @ManyToOne(() => Product, product => product.reviews)
  product: Product;
}