// src/tenants/tenants.service.ts
import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  // 1. إنشاء
  async create(createTenantDto: CreateTenantDto) {
    return await this.prisma.tenant.create({
      data: {
        name: createTenantDto.name,
        email: createTenantDto.email,
        plan: createTenantDto.plan,
      },
    });
  }

  // 2. جلب الكل
  async findAll() {
    return await this.prisma.tenant.findMany();
  }

  // 3. جلب واحد
  async findOne(id: string) {
    return await this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  // 4. التحديث (تم الإصلاح والكتابة) 🛠️
  async update(id: string, updateTenantDto: UpdateTenantDto) {
    // الآن نحن نستخدم المتغير updateTenantDto، فالخطأ سيختفي
    return await this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  // 5. الحذف (تمت الكتابة) 🗑️
  async remove(id: string) {
    return await this.prisma.tenant.delete({
      where: { id },
    });
  }
}
