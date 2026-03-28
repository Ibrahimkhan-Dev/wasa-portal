import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsUUID()
  @IsOptional()
  roleId?: string;

  @IsEnum(['active', 'inactive', 'blocked'])
  @IsOptional()
  status?: string;
}
