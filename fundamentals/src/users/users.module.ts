import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module'; // Adjust the path if necessary
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.Entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    forwardRef(() => AuthModule)], // Use forwardRef if necessary
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
