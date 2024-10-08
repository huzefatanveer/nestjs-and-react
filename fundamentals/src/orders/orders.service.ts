import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(OrdersService.name);
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, products } = createOrderDto;
  //  console.log('Creating order with user ID:', userId);

    // Calculate the total price
    const totalPrice = products.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    try {
      // Create a new order
      const order = this.orderRepository.create({
        user: { id: userId },
        totalPrice,
        status: 'pending',
      });

      // Save the order to get an ID
      const savedOrder = await this.orderRepository.save(order);

      // Create Stripe Payment Intent with orderId in metadata
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
        currency: 'usd',
        metadata: { 
          userId: userId.toString(),
          orderId: savedOrder.id.toString(),
        },
      });

      // Update the order with the PaymentIntent ID
      savedOrder.paymentIntentId = paymentIntent.id;
      await this.orderRepository.save(savedOrder);

      // Create order products
      const orderProducts = products.map((product) =>
        this.orderProductRepository.create({
          order: savedOrder,
          product: { id: product.id } as Product,
          quantity: product.quantity,
          unitPrice: product.price,
          totalPrice: product.price * product.quantity,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
        }),
      );

      // Save all order products
      const savedOrderProduct = await this.orderProductRepository.save(orderProducts);
      //console.log(savedOrderProduct)
      return {
        order: savedOrder,
        orderProduct: savedOrderProduct,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw new Error(`Error creating order: ${error.message}`);
    }
  }
  async updateOrderStatus(orderId: string, status: string) {
    this.logger.log(`Updating order status for Order ID: ${orderId}`);
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (order) {
      order.status = status;
      const updatedOrder = await this.orderRepository.save(order);
      this.logger.log(`Order ${order.id} status updated to ${status}`);
      return updatedOrder;
    }
    this.logger.error(`Order not found for Order ID: ${orderId}`);
    throw new Error('Order not found');
  }


  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findAll() {
    return await this.orderRepository.find({ relations: ['orderProducts'] });
  }

  // async findOne(id: string) {
  //   return await this.orderRepository.findOne({
  //     where: { id }, // Pass the id directly if it's a string
  //     relations: ['orderProducts'],
  //   });
  // }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new Error('Order not found');

    // Apply the updates
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new Error('Order not found');
    return this.orderRepository.remove(order);
  }

  

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderProducts'],
    });
    this.logger.log(`Retrieved order ${id} with status: ${order?.status}`);
    return order;
  }
  
}
