// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service'; // <--- 1. استيراد
import { ContactsModule } from './contacts/contacts.module';
import { ConversationsModule } from './conversations/conversations.module';
import { EventsGateway } from './events/events.gateway';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';

@Module({
  imports: [
    TenantsModule,
    UsersModule,
    AuthModule,
    WhatsappModule,
    ContactsModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EventsGateway], // <--- 2. إضافة هنا
})
export class AppModule {}
