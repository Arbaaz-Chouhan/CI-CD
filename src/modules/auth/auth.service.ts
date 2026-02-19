// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRY_IN || '1d') as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRY_IN || '7d') as any,
    });
    return { accessToken, refreshToken };
  }

  //verify jwt
  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
