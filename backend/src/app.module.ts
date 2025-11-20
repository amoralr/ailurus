import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FoldersModule } from './modules/folders/folders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [PrismaModule, DocumentsModule, FoldersModule, CategoriesModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
