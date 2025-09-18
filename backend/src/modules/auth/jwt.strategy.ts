import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret123', // 🔑 usa o mesmo secret do AuthService
    });
  }

  async validate(payload: any) {
    // Aqui você retorna o que vai dentro do req.user
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}