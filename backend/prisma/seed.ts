import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. إنشاء الشركة (مع رقم الواتساب الخاص بالتجربة)
  // نستخدم upsert: إذا كانت موجودة لا تفعل شيئاً، إذا غير موجودة أنشئها
  const tenant = await prisma.tenant.upsert({
    where: { whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID! }, // رقم الاختبار الخاص بك
    update: {},
    create: {
      name: 'Wisal HQ',
      email: process.env.ADMIN_EMAIL!,
      plan: 'ENTERPRISE',
      whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    },
  });

  console.log(`🏢 Tenant ready: ${tenant.name}`);

  // 2. تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

  // 3. إنشاء المدير
  const user = await prisma.user.upsert({
    where: { email: 'admin@wisal.com' },
    update: {
      password: hashedPassword, // تحديث الباسورد في حال نسيته
    },
    create: {
      email: process.env.ADMIN_EMAIL!,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  console.log(
    `👤 User ready: ${user.email} (Password: ${process.env.ADMIN_PASSWORD})`,
  );
  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
