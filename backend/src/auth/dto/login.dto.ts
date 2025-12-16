import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// هذا الكلاس يمثل البيانات التي سيرسلها المستخدم لتسجيل الدخول
export class LoginDto {
  // 1. التحقق من أن الإيميل مكتوب بصيغة صحيحة وليس فارغاً
  @IsNotEmpty()
  @IsEmail({}, { message: 'الرجاء إدخال بريد إلكتروني صحيح' })
  email!: string;

  // 2. التحقق من كلمة المرور (يجب أن تكون نصاً ولا تقل عن 6 أحرف)
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'كلمة المرور قصيرة جداً' })
  password!: string;
}
