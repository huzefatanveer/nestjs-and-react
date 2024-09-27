// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UsersService } from './users.service';
// import { JwtPayload } from './jwt-payload.interface';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private usersService: UsersService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'your-secret-key', // Use a better secret in production
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const { email } = payload;
//     const user = await this.usersService.findByEmail(email);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
