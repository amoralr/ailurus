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

  @Get(':slug/navigation')
  getNavigation(@Param('slug') slug: string) {
    return this.documentsService.getNavigation(slug);
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

  @Post(':id/folders/:folderId')
  @HttpCode(HttpStatus.CREATED)
  addToFolder(
    @Param('id', ParseIntPipe) id: number,
    @Param('folderId', ParseIntPipe) folderId: number,
  ) {
    return this.documentsService.addToFolder(id, folderId);
  }

  @Delete(':id/folders/:folderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromFolder(
    @Param('id', ParseIntPipe) id: number,
    @Param('folderId', ParseIntPipe) folderId: number,
  ) {
    return this.documentsService.removeFromFolder(id, folderId);
  }

  @Get('orphans/list')
  getOrphans() {
    return this.documentsService.findOrphans();
  }
}
