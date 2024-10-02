import { BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from '../role.enum';
import * as bcrypt from 'bcryptjs'
import { Order } from "src/orders/entities/order.entity";
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column ({ unique: true })
    email: String;

    @Column ()
    password: string;

    @Column({ nullable: true })
    stripeCustomerId: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role; 

    @Column()
    @UpdateDateColumn()
    updateAt: Date

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8)
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }

}
