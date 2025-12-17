// src/conversations/conversations.module.ts
import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from '../prisma.service';
import { EventsModule } from '../events/events.module'; // 👈 تأكد من المسار الصحيح

@Module({
  imports: [EventsModule], // 👈 أضفنا هذا السطر ليتعرف السيرفس على الـ Gateway
  controllers: [ConversationsController],
  providers: [ConversationsService, PrismaService],
})
export class ConversationsModule {}
