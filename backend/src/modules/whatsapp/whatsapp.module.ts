import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { PrismaService } from '../../prisma.service';
import { HttpModule } from '@nestjs/axios'; // 👈 إضافة جديدة

@Module({
  imports: [HttpModule], // 👈 إضافة جديدة
  controllers: [WhatsappController],
  providers: [WhatsappService, PrismaService],
})
export class WhatsappModule {}
