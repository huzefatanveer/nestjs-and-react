import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from '../role.enum';
import * as bcrypt from 'bcryptjs'
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column ({ unique: true })
    email: String;

    @Column ()
    password: string;

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
