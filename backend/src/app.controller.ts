import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './modules/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      prisma: 'connected',
    };
  }

  @Get('test-db')
  async testDb() {
    try {
      const count = await this.prisma.document.count();
      const categories = await this.prisma.category.findMany();
      return {
        documentsCount: count,
        categoriesCount: categories.length,
        categories: categories.map(c => c.id),
      };
    } catch (error) {
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
