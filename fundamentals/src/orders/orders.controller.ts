import { Controller, Post, Body, Patch, Param, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Assuming you are using JWT-based auth
import { CurrentUser } from '../auth/decorators/current-user.decorator'; // Custom decorator to get current user

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order (Requires authentication)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user) {
    // Ensure the userId is assigned to the DTO if not passed explicitly
    createOrderDto.userId = user.id;

    // Pass the createOrderDto to the service
    const order = await this.ordersService.createOrder(createOrderDto);
    return { success: true, order };
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
    return await this.ordersService.findOne(+id);
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
}
