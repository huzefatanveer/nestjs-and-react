import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
   // console.log('Entire request object:', JSON.stringify(request, null, 2));
   // console.log('Request headers:', request.headers);
   // console.log('Request user:', request.user);
   console.log( "user email is", request.user)
    return request.user;
  },
);