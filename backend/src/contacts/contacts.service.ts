import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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
    const result = await this.prisma.contact.updateMany({
      where: { id, tenantId },
      data: updateContactDto,
    });

    // 👇 التحسين: إذا لم يتم تحديث أي صف، يعني العنصر غير موجود أو لا يملكه
    if (result.count === 0) {
      throw new NotFoundException(
        'جهة الاتصال غير موجودة أو لا تملك صلاحية تعديلها',
      );
    }

    return { success: true, message: 'تم التحديث بنجاح' };
  }

  // 5. الحذف (معدلة)
  async remove(id: string, tenantId: string) {
    const result = await this.prisma.contact.deleteMany({
      where: { id, tenantId },
    });

    // 👇 التحسين: نفس الشيء للحذف
    if (result.count === 0) {
      throw new NotFoundException('جهة الاتصال غير موجودة');
    }

    return { success: true, message: 'تم الحذف بنجاح' };
  }
}
