import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([Product]),
    JwtModule,
    MulterModule.register({
      dest: '../../uploads', // Specify the upload directory
    }),
    forwardRef(() => OrdersModule)
    ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
