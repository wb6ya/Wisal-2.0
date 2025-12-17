// src/conversations/dto/create-message.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MsgType } from '@prisma/client';

export class CreateMessageDto {
  // محتوى الرسالة النصي
  @IsOptional()
  @IsString()
  content?: string;

  // نوع الرسالة (نص، صورة، فيديو...)
  @IsOptional()
  @IsEnum(MsgType)
  type: MsgType = MsgType.TEXT; // القيمة الافتراضية نص

  // رابط الميديا (لو كانت صورة أو ملف)
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
