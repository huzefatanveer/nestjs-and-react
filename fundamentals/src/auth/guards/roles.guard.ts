// src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    const decodedToken = this.jwtService.decode(token) as { role: Role };

    return requiredRoles.includes(decodedToken.role);
  }
}




// // src/auth/roles.guard.ts
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from '../../users/role.enum';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) {}

//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
//         if (!requiredRoles) {
//             return true;
//         }
//         const request = context.switchToHttp().getRequest();
//         const user = request.user;
//         return user && requiredRoles.includes(user.role);
//     }
// }
