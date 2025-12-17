import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateContactDto {
  // اسم العميل (مطلوب)
  @IsNotEmpty({ message: 'اسم العميل مطلوب' })
  @IsString()
  name!: string;

  // رقم الهاتف (اختياري، لكن مهم للواتساب)
  // لم نستخدم IsPhoneNumber لتجنب تعقيدات صيغ الدول حالياً
  @IsOptional()
  @IsString()
  phone?: string;

  // البريد الإلكتروني (اختياري)
  @IsOptional()
  @IsEmail({}, { message: 'صيغة البريد الإلكتروني غير صحيحة' })
  email?: string;

  // رابط الصورة (اختياري)
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  // التصنيفات (Tags) - مصفوفة نصوص (مثلاً: ["VIP", "New"])
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // تأكد أن كل عنصر داخل المصفوفة هو نص
  tags?: string[];
}
