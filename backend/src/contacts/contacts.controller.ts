// src/contacts/contacts.controller.ts

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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

// 🔒 تفعيل الحماية على كل الروابط (ممنوع الدخول بدون توكن)
@UseGuards(AuthGuard('jwt'))
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto, @Request() req: any) {
    // req.user يأتي من الاستراتيجية (JwtStrategy) التي برمجناها سابقاً
    // ويحتوي على بيانات الموظف بما فيها tenantId
    const tenantId = req.user.tenantId;
    return this.contactsService.create(createContactDto, tenantId);
  }

  @Get()
  findAll(@Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.contactsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.contactsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.contactsService.update(id, updateContactDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.contactsService.remove(id, tenantId);
  }
}
