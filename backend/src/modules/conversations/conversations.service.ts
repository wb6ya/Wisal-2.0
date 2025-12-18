import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  // 1. جلب قائمة المحادثات (القائمة الجانبية في الشات)
  async findAll(tenantId: string) {
    return this.prisma.conversation.findMany({
      where: { tenantId },
      include: {
        contact: true, // نحتاج اسم العميل وصورته
        messages: {
          take: 1, // آخر رسالة فقط لعرضها في القائمة
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' }, // الأحدث أولاً
    });
  }

  // 2. جلب رسائل محادثة معينة (الشات الكامل)
  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'asc' }, // الترتيب الزمني الصحيح للرسائل
        },
      },
    });
  }
}
