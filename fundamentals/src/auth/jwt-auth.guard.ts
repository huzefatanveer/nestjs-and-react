import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
      }
    
      handleRequest(err, user, info) {
        // console.log('JwtAuthGuard handleRequest - user:', user);
        // console.log('JwtAuthGuard handleRequest - err:', err);
        // console.log('JwtAuthGuard handleRequest - info:', info);
        if (err || !user) {
          throw err || new Error('User not found in JWT');
        }
        return user;
      }
}