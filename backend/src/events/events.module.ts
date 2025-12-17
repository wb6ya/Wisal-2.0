// src/events/events.module.ts

import { Module, Global } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Global() // 👈 جعلنا الموديول عالمياً لكي لا نضطر لاستيراده في كل مكان
@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // 👈 تصدير البوابة لتستخدمها الخدمات الأخرى
})
export class EventsModule {}
