// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ تفعيل التحقق من المدخلات عالمياً
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 🛡️ تحذف أي حقل زائد غير موجود في الـ DTO (حماية من الحشو)
      forbidNonWhitelisted: true, // (اختياري) يرجع خطأ إذا أرسل المستخدم حقلاً غير معروف
      transform: true, // يحول البيانات تلقائياً (مثلاً string إلى number إذا كان الـ DTO يطلب ذلك)
    }),
  );

  // ✅ تفعيل CORS (عشان الفرونت إند يقدر يكلم الباك إند)
  app.enableCors();

  await app.listen(process.env.PORT!);
}
void bootstrap();
