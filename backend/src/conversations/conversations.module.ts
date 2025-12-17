// src/conversations/conversations.module.ts

import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    PrismaService, // 👈 لا تنسَ هذا السطر أبداً
  ],
})
export class ConversationsModule {}
