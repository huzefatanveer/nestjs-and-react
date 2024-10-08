import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.Entity';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderProduct } from './orders/entities/order-product.entity';
import { RawBodyMiddleware } from './raw-body.middleware';
//import { MailModule } from './mail/mail.module';



@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env', // initialize .env file
      cache: true,
      isGlobal: true,
    }),
    // MulterModule.register({
    //   dest: '../uploads', // defines accessible route for uploaded files
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME || 'root',  // Ensure this is set
      password: process.env.DB_PASSWORD || '',  // Ensure this is set
      database: process.env.DB_NAME || 'huz',  // Ensure this is set
      entities: [User, Product, Order, OrderProduct],
      synchronize: true,
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    //MailModule,


    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'huz',
    //   entities: [],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes('orders/webhook'); // Apply to the webhook route
  }
 }
