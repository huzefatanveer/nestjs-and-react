import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { Stripe } from 'stripe'; // Install `stripe` package
import { Product } from 'src/products/entities/product.entity'; // Import your Product entity
@Injectable()
export class OrdersService {

  private stripe: Stripe;

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct) private orderProductRepository: Repository<OrderProduct>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, products } = createOrderDto;

    // Calculate the total price
    const totalPrice = products.reduce((total, item) => total + item.price * item.quantity, 0);

    try {
      // Create Stripe Payment Intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
        currency: 'usd',
      });

      // Create a new order
      const order = this.orderRepository.create({
        user: { id: userId },
        totalPrice,
        paymentIntentId: paymentIntent.id,
        status: 'pending',
      });

      // Save the order
      const savedOrder = await this.orderRepository.save(order);

      // Create order products
      const orderProducts = products.map(product => {
        const orderProduct = this.orderProductRepository.create({
          order: savedOrder,
          product: { id: product.id } as Product, // Ensure to use the correct type
          quantity: product.quantity,
          unitPrice: product.price, // Change to unitPrice to match your OrderProduct entity
          totalPrice: product.price * product.quantity, // Calculate total price for the order product
          name: product.name, // Assuming you pass the product name as part of the product object
          description: product.description,
          imageUrl : product.imageUrl,
        });
        return orderProduct;
      });

      // Save all order products at once for better performance
      await this.orderProductRepository.save(orderProducts);

      return savedOrder;
    } catch (error) {
      // Handle Stripe errors and throw custom error
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async updateOrderStatus(paymentIntentId: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { paymentIntentId } });
    if (order) {
      order.status = status;
      return this.orderRepository.save(order);
    }
    throw new Error('Order not found');
  }








  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
