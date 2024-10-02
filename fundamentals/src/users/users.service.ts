import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.Entity'
import * as bcrypt from 'bcryptjs'
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.enum';
import { OrdersService } from 'src/orders/orders.service';


@Injectable()
export class UsersService {
//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
// ) {}
constructor(private ordersService: OrdersService) {}

  async create(createUserDto: CreateUserDto) {
    const user = User.create(createUserDto);
    await user.save()

    delete user.password;
    return user;
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);
    delete user.password;
    return user;
  }

  async findById(id: number) {
    return await User.findOne({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email
      }
    })
  }
//   async updateUserRole(id: string, role: string): Promise<User> {
//     const user = await this.usersRepository.findOneBy({ id: Number(id) }); // Convert string ID to number
//     if (!user) {
//         throw new Error('User not found');
//     }

//     user.role = role as Role; // Ensure role is cast to the Role enum type if needed
//     return this.usersRepository.save(user);
// }

// async getUserOrderHistory(userId: number) {
//   return await this.ordersService.(userId); // Fetch orders for the user
// }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
