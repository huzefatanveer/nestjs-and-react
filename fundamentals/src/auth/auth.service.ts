import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './auth-login.dto';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class AuthService {

    constructor (
        private userService: UsersService,
        private jwtService: JwtService,
        private ordersService: OrdersService

    ){}

    async login(authLoginDto: AuthLoginDto) {
        const user = await this.validateUser( authLoginDto);

        console.log(user)
        const payload = {
            userId: user.id,
            role: user.role,
            email: user.email

        };
        console.log( this.jwtService.sign(payload))
        console.log(user.role)
        return {
            access_token: this.jwtService.sign(payload, {expiresIn: '5h'}),
            role: user.role,
            user: user

        }
    }

    async validateUser (authLoginDto: AuthLoginDto) {
        const {email,password} = authLoginDto;
        const user = await this.userService.findByEmail(email);
        if(!(await user?.validatePassword(password))){
            throw new UnauthorizedException();
        }

        return user;

    }

}