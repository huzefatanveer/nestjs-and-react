import {
  Controller,
  Post,
  Body,
  Patch,
  Logger,
  Param,
  Get,
  Delete,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Assuming you are using JWT-based auth
import { CurrentUser } from '../auth/decorators/current-user.decorator'; // Custom decorator to get current user
import * as express from 'express';
import Stripe from 'stripe';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';

@Controller('orders')
export class OrdersController {
  private stripe: Stripe;
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService,
   private readonly mailService: MailService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  // Create a new order (Requires authentication)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    //console.log('User from JWT:', user); // Log the entire user object

    // Ensure the userId is assigned to the DTO if not passed explicitly
    createOrderDto.userId = user.userId;

   // console.log('User ID to be passed:', createOrderDto.userId);

    // Pass the createOrderDto to the service
    const { order,orderProduct, paymentIntentId, clientSecret } =
      await this.ordersService.createOrder(createOrderDto);
    
      const orderDetails = this.formatOrderDetails(order,orderProduct);

      console.log(user.email)
      const sentMail= await this.mailService.sendEmail(
      user.email, // User's email from JWT or payload
      'Order Confirmation',
      orderDetails,

      //`Your order has been placed successfully! Order ID: ${order.id}`,
    );
   // console.log('sent mail:' ,sentMail)
    //console.log(orderProduct)
    return {
      success: true,
      orderId: order.id,
      
      paymentIntentId: paymentIntentId,
      clientSecret: clientSecret, // Return the payment intent ID
    };
  }

  private formatOrderDetails(order: any, orderProduct: any[]): string {
    let orderSummary = `Thank you for your order! Here are your order details:\n\n`;
    orderSummary += `Order ID: ${order.id}\n`;
    orderSummary += `Order Date: ${order.createdAt}\n`;
    orderSummary += `Products:\n`;
  
    // Loop through each orderProduct to append product details
    orderProduct.forEach((product) => {
      orderSummary += `Product Name: ${product.name}\n`;
      orderSummary += `Quantity: ${product.quantity}\n`;
      orderSummary += `Unit Price: $${product.unitPrice}\n`;

      orderSummary += `Description: ${product.description}\n\n`;
    });
  
    orderSummary += `\nTotal Amount: $${order.totalPrice}\n`;
    orderSummary += `\nWe hope you enjoy your purchase!`;
  
    return orderSummary;
  }
  

  // Get all orders (Admin access, assuming role-based guards are in place)
  @UseGuards(JwtAuthGuard) // Add a specific guard for admin if necessary
  @Get()
  async findAllOrders() {
    return await this.ordersService.findAll();
  }

  // Get a specific order by ID (Requires authentication)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneOrder(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  // Update an existing order (Admin or User, depending on role)
  @UseGuards(JwtAuthGuard)
  @Patch('onPayment')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const updatedOrder = await this.ordersService.update(id, updateOrderDto);
    return { success: true, updatedOrder };
  }

  // Update order status (Webhook or admin update)
  @Patch(':paymentIntentId/status')
  async updateOrderStatus(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const updatedOrder = await this.ordersService.updateOrderStatus(
      paymentIntentId,
      updateOrderDto.status,
    );
    return { success: true, updatedOrder };
  }

  // Delete an order (Admin access)
  @UseGuards(JwtAuthGuard) // You may need a guard specifically for admin access
  @Delete(':id')
  async removeOrder(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return { success: true, message: `Order #${id} deleted successfully` };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<express.Request>,
    @Res() res: express.Response,
    
  ) {
    console.log('receivded webhook:', req.body);
    const signature = req.headers['stripe-signature'];
    this.logger.log(`Received Stripe webhook with signature: ${signature}`);

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_EP_SIGNATURE,
      );
      this.logger.log(`Constructed Stripe event: ${event.type}`);
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      return res.status(400).send(`error of webhook: ${err.message}`);
    }

    if (
      event.type === 'payment_intent.succeeded' ||
      event.type === 'payment_intent.payment_failed'
    ) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        this.logger.error('No orderId found in PaymentIntent metadata');
        return res.status(400).send('No orderId found');
      }

      const newStatus =
        event.type === 'payment_intent.succeeded' ? 'paid' : 'failed';

      try {
        const updatedOrder = await this.ordersService.updateOrderStatus(
          orderId,
          newStatus,
        );
        this.logger.log(
          `Order ${updatedOrder.id} status updated to ${newStatus}`,
        );
      } catch (error) {
        this.logger.error(`Error updating order status: ${error.message}`);
        return res.status(500).send('Error updating order status');
      }
    }

    res.status(200).json({ received: true }).end();
  }
}
