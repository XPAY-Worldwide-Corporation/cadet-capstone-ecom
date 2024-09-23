import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from '../reviews/review.entity';
import { Wishlist } from '../wishlists/wishlist.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, wishlist => wishlist.product)
  wishlists: Wishlist[];
}