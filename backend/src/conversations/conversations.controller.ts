// src/conversations/conversations.controller.ts

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // 1. فتح محادثة جديدة
  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.conversationsService.create(createConversationDto, tenantId);
  }

  // 2. جلب كل المحادثات (Inbox)
  @Get()
  findAll(@Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.conversationsService.findAll(tenantId);
  }

  // 3. عرض تفاصيل محادثة معينة
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.conversationsService.findOne(id, tenantId);
  }

  // 4. إرسال رسالة داخل المحادثة
  @Post(':id/messages')
  sendMessage(
    @Param('id') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: any,
  ) {
    const tenantId = req.user.tenantId;
    // حذفنا تمرير userId لأنه لم يعد مطلوباً في الدالة
    return this.conversationsService.addMessage(
      conversationId,
      createMessageDto,
      tenantId,
    );
  }
}
