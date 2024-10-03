import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            //secretOrKey: process.env.JWT_SECRET
            secretOrKey: "pplucky1234"
            
        }) 
    }
    async validate(payload: any) {
        console.log('JwtStrategy validate - payload:', payload);
        const user = { userId: payload.userId, role: payload.role };
        console.log('JwtStrategy validate - returning user:', user);
        return user;
    }

}