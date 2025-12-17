// src/contacts/contacts.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from '@nestjs/passport';

// 👇 تعريف واجهة مخصصة لتحديد شكل البيانات داخل الـ Request
// هذا يحل مشكلة (Unsafe member access) و (Unsafe assignment)
interface RequestWithUser {
  user: {
    tenantId: string; // ⚠️ ملاحظة: إذا كان الـ ID في قاعدة بياناتك رقم، غيرها إلى number
  };
}

@UseGuards(AuthGuard('jwt'))
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(
    @Body() createContactDto: CreateContactDto,
    @Request() req: RequestWithUser,
  ) {
    // الآن TypeScript يعرف أن tenantId موجود ونوعه string
    const tenantId = req.user.tenantId;
    return this.contactsService.create(createContactDto, tenantId);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    const tenantId = req.user.tenantId;
    return this.contactsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    const tenantId = req.user.tenantId;
    return this.contactsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() req: RequestWithUser,
  ) {
    const tenantId = req.user.tenantId;
    return this.contactsService.update(id, updateContactDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    const tenantId = req.user.tenantId;
    return this.contactsService.remove(id, tenantId);
  }
}
