/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  // ✅ التصحيح: إزالة async لأننا لا نستخدم await حالياً
  processWebhookPayload(body: any) {
    if (!body.entry) return;

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        if (value.messages && value.messages.length > 0) {
          const message = value.messages[0];
          const senderPhone = message.from;
          const messageType = message.type;
          const businessPhoneId = value.metadata.phone_number_id;

          // ✅ التصحيح: استخدام المتغيرات في الطباعة لتجنب خطأ Unused Vars
          console.log(
            `🔔 New Message from ${senderPhone} (Type: ${messageType}) to Business: ${businessPhoneId}`,
          );
          console.log(JSON.stringify(message, null, 2));

          // الكود المستقبلي سيتم وضعه هنا
        }
      }
    }
  }
}
