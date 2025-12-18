// src/app.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // 👈 استدعاء
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service'; // <--- 1. استيراد
import { ContactsModule } from './contacts/contacts.module';
import { EventsGateway } from './events/events.gateway';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ConversationsModule } from './modules/conversations/conversations.module';

@Module({
  imports: [
    TenantsModule,
    UsersModule,
    AuthModule,
    WhatsappModule,
    ContactsModule,
    ConversationsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    EventsGateway,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ], // <--- 2. إضافة هنا
})
export class AppModule {}
