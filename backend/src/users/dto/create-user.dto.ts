import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsNotEmpty()
  @IsString()
  tenantId!: string;
}
