import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { UserService } from '../user/user.service';
import { User } from '../user/models/user.entity';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  getToken(authHeader?: string) {
    if (!authHeader) return;

    const match = authHeader.match(/[Bb]earer (?<token>.*)/);
    if (!match) return;

    const { token } = match.groups as { token: string };
    return token;
  }

  signToken() {
    return this.jwtService.sign({ jti: uuidv4() });
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify<Record<string, unknown>>(token);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  signUp(input: SignUpInput) {
    const password = hashSync(input.password, 12);
    const token = this.signToken();
    return this.userService.create({
      email: input.email,
      password,
      token,
    });
  }

  async signIn(input: SignInInput) {
    const user = await this.userService.findOneBy({ email: input.email });
    const token = this.signToken();
    user!.token = token;
    return this.userService.save(user!);
  }

  async logOut(user: User) {
    return this.userService.update({ id: user.id }, { token: null });
  }
}
