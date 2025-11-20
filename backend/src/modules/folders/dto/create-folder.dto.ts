import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength, IsInt } from 'class-validator';
import { FolderType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  path: string;

  @IsEnum(FolderType)
  type: FolderType;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  parentId?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  order?: number;
}
