import { Injectable, NestMiddleware } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NextFunction } from 'express';

import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/models/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(
    req: Request & { headers: { authorization: string }; user: User },
    res: Response,
    next: NextFunction,
  ) {
    const token = this.authService.getToken(req.headers.authorization);
    if (!token) {
      return next();
    }

    const isVerified = this.authService.verifyToken(token);
    if (!isVerified) {
      return next();
    }

    const user = await this.userService.findOneBy({
      token,
    });

    if (!user) {
      return next();
    }

    req.user = plainToInstance(User, user);
    next();
  }
}
