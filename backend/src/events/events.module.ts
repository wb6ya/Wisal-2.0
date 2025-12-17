// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // 👈 مهم جداً: هذا السطر يسمح للموديولات الأخرى باستخدامه
})
export class EventsModule {}
