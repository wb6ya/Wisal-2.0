// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ContactsModule } from './contacts/contacts.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { PrismaService } from './prisma.service'; // <--- 1. استيراد

@Module({
  imports: [
    TenantsModule,
    UsersModule,
    AuthModule,
    ConversationsModule,
    ContactsModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService], // <--- 2. إضافة هنا
})
export class AppModule {}
