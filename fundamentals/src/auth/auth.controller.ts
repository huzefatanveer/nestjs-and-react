import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './auth-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {
    }

    @Post()
    async login(@Body() authLoginDto: AuthLoginDto) {
        console.log('Login attempt with:', authLoginDto);
        return this.authService.login(authLoginDto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('admin-data')
    @Get()
    async test() {
        return "Success Login";
    }
}
