import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * GET /search?q=query&limit=10&offset=0
   */
  @Get()
  async search(
    @Query('q') query: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    if (!query) {
      return {
        results: [],
        total: 0,
        query: '',
        page: 1,
        limit,
      };
    }

    const results = await this.searchService.search(query, limit, offset);
    
    // Log search (userId hardcoded como 'anonymous' por ahora)
    await this.searchService.logSearch(query, 'anonymous', results.total);
    
    return results;
  }
}
