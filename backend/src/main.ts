import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. تفعيل درع الحماية (Helmet) 🛡️
  app.use(helmet());

  // 2. تفعيل CORS (السماح للفرونت إند فقط) 🚧
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // 👈 ضع هنا رابط الفرونت إند الحقيقي عند الرفع
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. تفعيل الفلترة الصارمة (Validation) 🧹
  // أي حقل زائد غير موجود في الـ DTO سيتم حذفه ورفض الطلب
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // احذف أي حقل غير معروف
      forbidNonWhitelisted: true, // ارفض الطلب إذا فيه حقل زائد
      transform: true, // حول الأرقام النصية إلى أرقام فعلية تلقائياً
    }),
  );

  await app.listen(3000);
  console.log(`🛡️  Server is Secure & Running on: http://localhost:3000`);
}
void bootstrap();
