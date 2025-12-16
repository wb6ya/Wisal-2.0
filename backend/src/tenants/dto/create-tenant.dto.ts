import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// تعريف قائمة الباقات المتاحة (Enum)
export enum PlanType {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
}

// ⚠️ تأكد أن كلمة export مكتوبة هنا قبل class
export class CreateTenantDto {
  // 1. التحقق من اسم الشركة
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'اسم الشركة يجب أن يكون 3 أحرف على الأقل' })
  name!: string;

  // 2. التحقق من البريد الإلكتروني
  @IsEmail()
  email!: string;

  // 3. التحقق من الباقة (اختياري)
  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;
}
