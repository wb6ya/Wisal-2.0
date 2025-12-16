// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// تعريف شكل البيانات الموجودة داخل التوكن (للترتيب فقط)
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  tenantId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. من أين نأخذ التوكن؟ من الـ Header (Authorization: Bearer ...)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. هل نرفض التوكن المنتهي الصلاحية؟ نعم طبعاً
      ignoreExpiration: false,
      // 3. نفس مفتاح التشفير السري الذي استخدمناه في Module
      // ⚠️ تذكير: يجب نقله لاحقاً لملف .env
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // هذه الدالة تعمل تلقائياً إذا كان التوكن صحيحاً
  validate(payload: JwtPayload) {
    // البيانات التي نرجعها هنا سيتم تخزينها في (request.user)
    // لتتمكن من استخدامها لاحقاً في الـ Controllers
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
    };
  }
}
