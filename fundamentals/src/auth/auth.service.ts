import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './auth-login.dto';

@Injectable()
export class AuthService {

    constructor (
        private userService: UsersService,
        private jwtService: JwtService
    ){}

    async login(authLoginDto: AuthLoginDto) {
        const user = await this.validateUser( authLoginDto);

        console.log(user)
        const payload = {
            userId: user.id,
            role: user.role

        };
        console.log( this.jwtService.sign(payload))
        console.log(user.role)
        return {
            access_token: this.jwtService.sign(payload, {expiresIn: '1h'}),
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