import { buildQuery } from '../utils';

interface ApiFetcher {
  get(
    path: string,
    query?: Record<string, unknown>,
    options?: RequestInit
  ): Promise<Response>;
  post<D>(path: string, data?: D, options?: RequestInit): Promise<Response>;
  delete<D>(path: string, data?: D, options?: RequestInit): Promise<Response>;
  put<D>(path: string, data?: D, options?: RequestInit): Promise<Response>;
  patch<D>(path: string, data?: D, options?: RequestInit): Promise<Response>;
}

class Fetcher implements ApiFetcher {
  private readonly _baseUrl: string;
  private readonly _timeoutSec: number;

  constructor(baseUrl: string, timeoutSec: number) {
    this._baseUrl = baseUrl;
    this._timeoutSec = timeoutSec;
  }

  private readonly _fetchActionWithTimeout = async (
    path: string,
    options?: RequestInit
  ) => {
    const uri = this._baseUrl + path;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this._timeoutSec);
    try {
      const response = await fetch(uri, {
        signal: controller.signal,
        ...options,
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  };

  get(path: string, query?: Record<string, unknown>, options?: RequestInit) {
    let queryStr = '';
    if (query) {
      queryStr = buildQuery(query);
    }
    const pathWithQuery = path + queryStr;
    return this._fetchActionWithTimeout(pathWithQuery, {
      method: 'GET',
      ...options,
    });
  }
  post<D>(path: string, data?: D, options?: RequestInit) {
    const body = data ? JSON.stringify(data) : undefined;
    return this._fetchActionWithTimeout(path, {
      method: 'POST',
      body,
      ...options,
    });
  }
  delete<D>(path: string, data?: D, options?: RequestInit) {
    const body = data ? JSON.stringify(data) : undefined;
    return this._fetchActionWithTimeout(path, {
      method: 'DELETE',
      body,
      ...options,
    });
  }
  put<D>(path: string, data?: D, options?: RequestInit) {
    const body = data ? JSON.stringify(data) : undefined;
    return this._fetchActionWithTimeout(path, {
      method: 'put',
      body,
      ...options,
    });
  }
  patch<D>(path: string, data?: D, options?: RequestInit) {
    const body = data ? JSON.stringify(data) : undefined;
    return this._fetchActionWithTimeout(path, {
      method: 'patch',
      body,
      ...options,
    });
  }
}

export { Fetcher, type ApiFetcher };
