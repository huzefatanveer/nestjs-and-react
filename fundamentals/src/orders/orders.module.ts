import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct]),
    forwardRef(() => ProductsModule), // forwardRef to avoid circular dependency
    forwardRef(() => UsersModule),
    // forwardRef(() => AuthModule),
    
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Export OrdersService for use in other modules
})
export class OrdersModule {}
