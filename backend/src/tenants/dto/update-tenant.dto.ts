// src/tenants/dto/update-tenant.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';

// هذا الكلاس يرث كل خصائص CreateTenantDto لكن يجعلها اختيارية
// يعني عند التحديث، لست مضطراً لإرسال كل البيانات، يمكن إرسال الاسم فقط مثلاً
export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
