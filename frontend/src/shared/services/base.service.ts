/**
 * Base HTTP client for API calls
 * Handles common configuration, error handling, and retry logic
 */
export class BaseApiService {
  private baseURL: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private MAX_RETRIES = 3;
  private INITIAL_RETRY_DELAY = 1000; // 1 second

  constructor() {
    this.baseURL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
  }

  /**
   * Helper para retry con exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = this.MAX_RETRIES,
    delay: number = this.INITIAL_RETRY_DELAY
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) {
        throw error;
      }

      // Solo reintentar en errores de red o 5xx
      const shouldRetry = 
        error instanceof TypeError || // Network error
        (error instanceof Error && error.message.includes('HTTP 5')); // 5xx errors

      if (!shouldRetry) {
        throw error;
      }

      console.log(`[API] Retrying request, ${retries} attempts left. Waiting ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff: duplicar el delay
      return this.retryWithBackoff(fn, retries - 1, delay * 2);
    }
  }

  /**
   * Generic GET request with caching and retry logic
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

    return this.retryWithBackoff(async () => {
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
    });
  }

  /**
   * Generic POST request with retry logic
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    return this.retryWithBackoff(async () => {
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
    });
  }

  /**
   * Generic PUT request with retry logic
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    return this.retryWithBackoff(async () => {
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
    });
  }

  /**
   * Generic DELETE request with retry logic
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    return this.retryWithBackoff(async () => {
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
    });
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[API] Cache cleared');
  }
}
