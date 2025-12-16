import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // حقن الاعتمادات: قاعدة البيانات + خدمة التوكن
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // دالة تسجيل الدخول
  async login(loginDto: LoginDto) {
    // 1. البحث عن المستخدم بواسطة الإيميل
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // 2. إذا لم نجد المستخدم، نرفض الدخول
    if (!user) {
      throw new UnauthorizedException('البيانات غير صحيحة');
    }

    // 3. مقارنة كلمة المرور المدخلة مع المشفرة
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    // 4. إذا كانت كلمة المرور خطأ
    if (!isPasswordValid) {
      throw new UnauthorizedException('البيانات غير صحيحة');
    }

    // 5. تجهيز بيانات التوكن (Payload)
    // هذه البيانات ستكون مخزنة داخل الكود المشفر
    const payload = {
      sub: user.id, // رقم الهوية
      email: user.email, // الإيميل
      role: user.role, // الصلاحية
      tenantId: user.tenantId, // الشركة
    };

    // 6. إصدار التوكن النهائي
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
