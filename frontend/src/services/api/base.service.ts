/**
 * Base HTTP client for API calls
 * Handles common configuration, error handling, and retry logic
 */
export class BaseApiService {
  private baseURL: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseURL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
  }

  /**
   * Generic GET request with caching
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    const cacheKey = url.toString();
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[API] Cache hit: ${endpoint}`);
      return cached.data;
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error(`[API] GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    try {
      console.log(`[API] POST ${endpoint}`, body);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.json();
          console.error(`[API] Error response:`, errorBody);
          errorMessage = errorBody.message || errorMessage;
          if (Array.isArray(errorBody.message)) {
            errorMessage = errorBody.message.join(', ');
          }
        } catch (e) {
          // If response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    try {
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    try {
      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[API] Cache cleared');
  }
}
