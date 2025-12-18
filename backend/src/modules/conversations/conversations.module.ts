import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from '../../prisma.service'; // 👈 1. استدعاء الملف

@Module({
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    PrismaService, // 👈 2. إضافتها هنا في قائمة المزودين
  ],
})
export class ConversationsModule {}
