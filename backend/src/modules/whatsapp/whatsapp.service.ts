/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async processWebhookPayload(body: any) {
    if (!body.entry) return;

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        if (value.messages && value.messages.length > 0) {
          const message = value.messages[0];
          const businessPhoneId = value.metadata.phone_number_id;

          const tenant = await this.prisma.tenant.findFirst({
            where: { whatsappPhoneNumberId: businessPhoneId },
          });

          if (!tenant) {
            console.error(
              `❌ Tenant not found for WhatsApp ID: ${businessPhoneId}`,
            );
            continue;
          }

          await this.handleIncomingMessage(
            tenant.id,
            businessPhoneId,
            message,
            value.contacts,
          );
        }
      }
    }
  }

  private async handleIncomingMessage(
    tenantId: string,
    businessPhoneId: string,
    message: any,
    contacts: any[],
  ) {
    const senderPhone = message.from;
    const textBody = message.text?.body || '';
    const senderName =
      contacts && contacts[0] ? contacts[0].profile.name : 'Unknown';

    // 1. البحث عن العميل أو إنشاؤه
    let contact = await this.prisma.contact.findFirst({
      where: { tenantId, phone: senderPhone },
    });

    if (!contact) {
      contact = await this.prisma.contact.create({
        data: { tenantId, phone: senderPhone, name: senderName },
      });
    }

    // 2. البحث عن المحادثة
    let conversation = await this.prisma.conversation.findFirst({
      where: { contactId: contact.id, status: 'OPEN' },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          tenantId,
          contactId: contact.id,
          status: 'OPEN',
          channel: 'WHATSAPP',
        },
      });
    }

    // 3. حفظ رسالة العميل (الداخلة)
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: textBody,
        type: 'TEXT',
        direction: 'INCOMING',
        status: 'DELIVERED',
      },
    });

    console.log(`💾 Incoming Message Saved: "${textBody}"`);

    // 4. الرد الآلي وحفظه
    const replyText = `شكراً لتواصلك يا ${senderName}!\nوصلتنا رسالتك: "${textBody}"`;

    // نمرر الـ conversation.id لكي نتمكن من حفظ الرد فيه
    await this.sendWhatsappMessage(
      businessPhoneId,
      senderPhone,
      replyText,
      conversation.id,
    );
  }

  // 👇 الدالة المحدثة: تستقبل conversationId وتحفظ الرسالة
  async sendWhatsappMessage(
    businessPhoneId: string,
    to: string,
    bodyText: string,
    conversationId: string, // معامل جديد
  ) {
    const url = `https://graph.facebook.com/v21.0/${businessPhoneId}/messages`;
    const token = process.env.WHATSAPP_API_TOKEN;

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: bodyText },
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      // 1. الإرسال لفيسبوك
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers }),
      );
      console.log('📤 Reply Sent to Meta:', response.data.messages[0].id);

      // 2. الحفظ في قاعدة البيانات (Outgoing) ✅
      await this.prisma.message.create({
        data: {
          conversationId: conversationId,
          content: bodyText,
          type: 'TEXT',
          direction: 'OUTGOING', // 👈 اتجاه صادر
          status: 'SENT',
        },
      });
      console.log('💾 Outgoing Message Saved to DB');
    } catch (error: any) {
      console.error(
        '❌ Error sending message:',
        error.response?.data || error.message,
      );
    }
  }
}
