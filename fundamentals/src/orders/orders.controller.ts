import { Controller, Post, Body, Patch, Param, Get, Delete, UseGuards, Headers, HttpCode, HttpStatus} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Assuming you are using JWT-based auth
import { CurrentUser } from '../auth/decorators/current-user.decorator'; // Custom decorator to get current user
import Stripe from 'stripe';

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
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any): Promise<void> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const sig = body.headers['stripe-signature'];
    let event;

    try {
      // Use the Stripe SDK to construct the event
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`Webhook signature verification failed.`, err);
      throw new Error('Webhook signature verification failed.');
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object; // Contains a Stripe payment intent
        await this.ordersService.updateOrderStatus(paymentIntent.id, 'succeeded');
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object; // Contains a Stripe payment intent
        await this.ordersService.updateOrderStatus(failedPaymentIntent.id, 'failed');
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
