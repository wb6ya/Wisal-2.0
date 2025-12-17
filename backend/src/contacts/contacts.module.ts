// src/contacts/contacts.module.ts

import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
// 1. استيراد خدمة قاعدة البيانات
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ContactsController],
  providers: [
    ContactsService,
    // 2. إضافة الخدمة هنا لتكون متاحة للاستخدام
    PrismaService,
  ],
})
export class ContactsModule {}
