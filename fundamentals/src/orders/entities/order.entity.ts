import { User } from "src/users/entities/user.Entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderProduct } from "./order-product.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  
  @Column('decimal')
  totalPrice: number;
  
  @Column({ type: 'enum', enum: ['pending', 'paid', 'failed'], default: 'pending' })
  paymentStatus: string;
  
  @Column({ nullable: true })
  paymentIntentId: string; // Stripe payment intent ID
  
  @Column({ nullable: true })
  stripeChargeId: string; // Stripe charge ID if payment is successful
  
  @Column()
  currency: string;
  
  // @Column()
  // shippingAddress: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ type: 'enum', enum: ['pending', 'paid', 'delivered', 'cancelled'], default: 'pending' })
  status: string;
  
  @Column()
  paymentMethod: string;
  
  @ManyToOne(() => User, (user) => user.orders)
  user: User;
  
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];
}
