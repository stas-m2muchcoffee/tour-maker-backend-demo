import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getToken(authHeader?: string) {
    if (!authHeader) return;

    const match = authHeader.match(/[Bb]earer (?<token>.*)/);
    if (!match) return;

    const { token } = match.groups as { token: string };
    return token;
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify<Record<string, unknown>>(token);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
