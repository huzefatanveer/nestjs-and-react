import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct]),
    forwardRef(() => ProductsModule), // forwardRef to avoid circular dependency
    forwardRef(() => UsersModule),
    // forwardRef(() => AuthModule),
    
  ],
  controllers: [OrdersController],
  providers: [OrdersService, MailService],
  exports: [OrdersService], // Export OrdersService for use in other modules
})
export class OrdersModule {}
