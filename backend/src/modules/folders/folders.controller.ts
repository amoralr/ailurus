import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FolderNodeResponseDto } from './dto/folder-node-response.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  /**
   * GET /folders - Retorna el árbol completo de folders
   */
  @Get()
  findAll(): Promise<FolderNodeResponseDto[]> {
    return this.foldersService.findAll();
  }

  /**
   * GET /folders/:path - Retorna un folder específico con sus children
   */
  @Get(':path')
  findByPath(@Param('path') path: string): Promise<FolderNodeResponseDto> {
    return this.foldersService.findByPath(path);
  }

  /**
   * POST /folders - Crea un nuevo folder
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.create(createFolderDto);
  }

  /**
   * PUT /folders/:id - Actualiza un folder existente
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    return this.foldersService.update(parseInt(id), updateFolderDto);
  }

  /**
   * DELETE /folders/:id - Elimina un folder
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.foldersService.delete(parseInt(id));
  }

  /**
   * DELETE /folders/:id/recursive - Elimina un folder y todo su contenido recursivamente
   */
  @Delete(':id/recursive')
  @HttpCode(HttpStatus.OK)
  deleteRecursive(@Param('id') id: string) {
    return this.foldersService.deleteRecursive(parseInt(id));
  }

  /**
   * GET /folders/:id/delete-preview - Obtiene información sobre qué se eliminará
   */
  @Get(':id/delete-preview')
  getDeletePreview(@Param('id') id: string) {
    return this.foldersService.countFoldersToDelete(parseInt(id));
  }
}
