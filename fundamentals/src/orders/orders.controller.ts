import { Controller, Post, Body, Patch, Param, Get, Delete, UseGuards, Headers, HttpCode, HttpStatus, RawBodyRequest,Req, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Assuming you are using JWT-based auth
import { CurrentUser } from '../auth/decorators/current-user.decorator'; // Custom decorator to get current user
import * as express from 'express';
import Stripe from 'stripe';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
    private stripe: Stripe;

  constructor(private readonly ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  }

  // Create a new order (Requires authentication)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    console.log("User from JWT:", user); // Log the entire user object
  
    // Ensure the userId is assigned to the DTO if not passed explicitly
    createOrderDto.userId = user.userId;
  
    console.log("User ID to be passed:", createOrderDto.userId);
  
    // Pass the createOrderDto to the service
    const { order, paymentIntentId, clientSecret } = await this.ordersService.createOrder(createOrderDto);
  
    // Return success message along with order ID and payment intent ID
    return {
      success: true,
      orderId: order.id,
      paymentIntentId: paymentIntentId,
      clientSecret: clientSecret,// Return the payment intent ID
    };
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
    @Body() updateOrderDto: UpdateOrderDto
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
    const updatedOrder = await this.ordersService.updateOrderStatus(paymentIntentId, updateOrderDto.status);
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
  @ApiCreatedResponse({ description: 'response here' })
  @ApiBadRequestResponse({ description: 'Expectation Failed, Please try again' })
  async handleWebhook(
    @Req() req: RawBodyRequest<express.Request>,
    @Res() res: express.Response
  ) {
    const signature = req.headers['stripe-signature'];
    console.log('Received Stripe webhook with signature:', signature);
    let event: Stripe.Event;
    
    console.log(this.stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_EP_SIGNATURE
    ))

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_EP_SIGNATURE
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        console.error('No orderId found in PaymentIntent metadata');
        return res.status(400).send('No orderId found');
      }

      const order = await this.ordersService.findOne(orderId);

      if (order) {
        const newStatus = event.type === 'payment_intent.succeeded' ? 'completed' : 'failed';
        order.status = newStatus;
        await this.ordersService.updateOrderStatus(order.paymentIntentId, newStatus);
        console.log(`Order ${order.id} status updated to ${newStatus}`);
      } else {
        console.error(`Order not found for orderId: ${orderId}`);
        return res.status(404).send('Order not found');
      }
    }

    // Acknowledge receipt of event
    res.json({ received: true });
  }
}
