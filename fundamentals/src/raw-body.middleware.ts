import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.body = '';

    req.on('data', (chunk) => {
      req.body += chunk;
    });

    req.on('end', () => {
      next();
    });
  }
}
