import { OrderProduct } from 'src/orders/entities/order-product.entity';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal')
    price: number;

    @Column()
    imageUrl: string;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
    orderProducts: OrderProduct[];
}

