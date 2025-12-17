import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express'; // ✅ التصحيح هنا: إضافة type
import { WhatsappService } from './whatsapp.service';

@Controller('webhook')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const MY_VERIFY_TOKEN =
      process.env.WHATSAPP_VERIFY_TOKEN || 'my_secret_wisal_token';

    if (mode === 'subscribe' && token === MY_VERIFY_TOKEN) {
      console.log('✅ Webhook Verified!');
      return res.status(HttpStatus.OK).send(challenge);
    } else {
      console.log('❌ Verification Failed');
      return res.status(HttpStatus.FORBIDDEN).send('Verification failed');
    }
  }

  @Post()
  handleIncomingMessage(
    @Body() body: Record<string, any>, // ✅ التصحيح: تجنب any الصريحة
    @Res() res: Response,
  ) {
    console.log('📩 New Event Received');

    if (body.object === 'whatsapp_business_account') {
      try {
        this.whatsappService.processWebhookPayload(body);
      } catch (error) {
        console.error('Error processing message:', error);
      }
      return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }
}
