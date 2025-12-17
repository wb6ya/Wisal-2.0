import { Injectable, ConflictException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  // 1. إنشاء عميل جديد
  async create(createContactDto: CreateContactDto, tenantId: string) {
    // قبل الإنشاء، نتحقق هل هذا الرقم موجود سابقاً لهذه الشركة؟
    // (لتجنب أخطاء قاعدة البيانات المزعجة)
    if (createContactDto.phone) {
      const existingContact = await this.prisma.contact.findFirst({
        where: {
          tenantId: tenantId,
          phone: createContactDto.phone,
        },
      });

      if (existingContact) {
        throw new ConflictException('رقم الهاتف مسجل مسبقاً لهذا العميل');
      }
    }

    // الحفظ في قاعدة البيانات
    return await this.prisma.contact.create({
      data: {
        name: createContactDto.name,
        phone: createContactDto.phone,
        email: createContactDto.email,
        avatarUrl: createContactDto.avatarUrl,
        tags: createContactDto.tags || [], // لو لم يرسل تاجز، نضع مصفوفة فارغة
        tenantId: tenantId, // 👈 أهم نقطة: ربط العميل بالشركة
      },
    });
  }

  // 2. جلب كل العملاء (التابعين لشركة محددة فقط)
  async findAll(tenantId: string) {
    return await this.prisma.contact.findMany({
      where: { tenantId }, // 🕵️‍♂️ فلترة حسب الشركة
      orderBy: { createdAt: 'desc' }, // الأحدث أولاً
    });
  }

  // 3. جلب عميل واحد
  async findOne(id: string, tenantId: string) {
    return await this.prisma.contact.findFirst({
      where: { id, tenantId }, // يجب أن يطابق الآيدي والشركة معاً
    });
  }

  // 4. التحديث
  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    tenantId: string,
  ) {
    // نستخدم updateMany كحيلة أمنية:
    // لأن update العادية تتطلب ID فقط، لكن updateMany تسمح بفلترة tenantId
    // فنضمن أن لا أحد يعدل عميل شركة أخرى
    const result = await this.prisma.contact.updateMany({
      where: { id, tenantId },
      data: updateContactDto,
    });
    // updateMany ترجع عدد الصفوف المعدلة ولا ترجع البيانات
    // لذلك نعيد إرجاع رسالة نجاح أو البيانات الجديدة بجلبها مرة أخرى
    return { count: result.count, message: 'تم التحديث بنجاح' };
  }

  // 5. الحذف
  async remove(id: string, tenantId: string) {
    return await this.prisma.contact.deleteMany({
      where: { id, tenantId },
    });
  }
}
