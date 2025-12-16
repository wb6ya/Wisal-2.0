// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// 1. نستورد خدمة بريزما (أداة قاعدة البيانات)
import { PrismaService } from '../prisma.service';

@Module({
  // المتحكمون (Controllers) المسؤولون عن استقبال الطلبات في هذا القسم
  controllers: [UsersController],

  // المزودون (Providers): الخدمات والأدوات التي يحتاجها هذا القسم ليعمل
  providers: [
    UsersService,
    // 2. نضيف بريزما هنا لكي يستطيع UsersService استخدامها
    PrismaService,
  ],
})
export class UsersModule {}
