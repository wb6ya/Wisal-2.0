// src/conversations/conversations.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'; // حذفنا ForbiddenException
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from '../prisma.service';
import { MsgDir, MsgStatus } from '@prisma/client';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ConversationsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // 1. فتح محادثة
  async create(createConversationDto: CreateConversationDto, tenantId: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id: createConversationDto.contactId },
    });

    if (!contact || contact.tenantId !== tenantId) {
      throw new NotFoundException(
        'العميل غير موجود أو لا تملك صلاحية الوصول إليه',
      );
    }

    return await this.prisma.conversation.create({
      data: {
        channel: createConversationDto.channel,
        contactId: createConversationDto.contactId,
        assigneeId: createConversationDto.assigneeId,
        tenantId: tenantId,
      },
      include: {
        contact: true,
        assignee: { select: { name: true, id: true } },
      },
    });
  }

  // 2. جلب الكل
  async findAll(tenantId: string) {
    return await this.prisma.conversation.findMany({
      where: { tenantId },
      include: {
        contact: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  // 3. جلب واحدة
  async findOne(id: string, tenantId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, tenantId },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('المحادثة غير موجودة');
    }

    return conversation;
  }

  // 4. إرسال رسالة (حذفنا userId من هنا)
  async addMessage(
    conversationId: string,
    createMessageDto: CreateMessageDto,
    tenantId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException('المحادثة غير موجودة');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: conversationId,
        content: createMessageDto.content,
        mediaUrl: createMessageDto.mediaUrl,
        type: createMessageDto.type,
        direction: MsgDir.OUTGOING,
        status: MsgStatus.SENT,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // إرسال التنبيه
    this.eventsGateway.emitToTenant(tenantId, 'message.new', message);

    return message;
  }
}
