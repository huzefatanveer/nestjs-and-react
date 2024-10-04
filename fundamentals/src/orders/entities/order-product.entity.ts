import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Order, (order) => order.orderProducts)

  order: Order;

  @ManyToOne(() => Product, (product)=> product.orderProducts)
  product: Product;

  @Column('integer')
  quantity: number;

  @Column('decimal')
  unitPrice: number;

  @Column('decimal')
  totalPrice: number;

  @Column()
  name: string; // Store product name in case the name changes after the order

  @Column()
  description: string;

  @Column()
  imageUrl: string;
}
