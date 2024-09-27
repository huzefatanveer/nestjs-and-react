import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginDto } from './dto/login-dto';
import * as bcrypt from 'bcryptjs'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from './role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.usersService.showById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // @Post('login')
  // async login(@Body() loginDto: loginDto) {
  //   const { email, password } = loginDto;
  //   const user = await this.usersService.findByEmail(email);
    
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
    
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   // If the password is valid, return the user (or a JWT token, depending on your auth setup)
  //   return { message: 'Login successful', user }; // You can also return a JWT or session token here
  // }

@UseGuards(JwtAuthGuard, RolesGuard)

@Get()
getUsers() {
    return this.usersService.findAll();
}
}
