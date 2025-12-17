import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Platform } from '@prisma/client';

export class CreateConversationDto {
  // معرف العميل الذي نريد التحدث معه
  @IsNotEmpty()
  @IsUUID()
  contactId!: string;

  // القناة المستخدمة (واتساب، تيليقرام، الخ)
  @IsNotEmpty()
  @IsEnum(Platform)
  channel!: Platform;

  // (اختياري) تعيين موظف مباشرة عند الإنشاء
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
