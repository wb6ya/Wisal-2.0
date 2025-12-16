// src/tenants/tenants.module.ts
import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
// 1. استيراد الخدمة (هذا السطر كان ناقصاً أو لم يُستخدم)
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TenantsController],
  // 2. إضافة الخدمة في قائمة المزودين (Providers)
  providers: [TenantsService, PrismaService],
})
export class TenantsModule {}
