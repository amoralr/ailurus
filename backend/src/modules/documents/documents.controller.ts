import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('docs')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.documentsService.findByCategory(category);
    }
    return this.documentsService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.documentsService.findBySlug(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateDocumentDto) {
    return this.documentsService.create(createDto);
  }

  @Put(':id/draft')
  updateDraft(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDraft(id, updateDto);
  }

  @Put(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.publish(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.archive(id);
  }
}
