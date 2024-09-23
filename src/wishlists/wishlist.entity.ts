import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item: string;

  @ManyToOne(() => User, user => user.wishlists)
  user: User;

  @ManyToOne(() => Product, product => product.wishlists)
  product: Product;
}