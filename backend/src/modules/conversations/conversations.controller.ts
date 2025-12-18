import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuard } from '@nestjs/passport';

// 👇 1. تعريف نوع الـ Request الخاص بنا
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    tenantId: string;
  };
}

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // 👇 2. استخدام النوع AuthenticatedRequest بدلاً من any
  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const user = req.user; // ✅ آمنة الآن

    // بما أننا عرفنا النوع، TypeScript يعرف الآن أن user يحتوي على tenantId
    return this.conversationsService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }
}
