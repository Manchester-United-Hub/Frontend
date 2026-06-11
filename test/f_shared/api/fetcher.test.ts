import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Fetcher } from '@shared/api/fetcher';

const BASE_URL = 'http://test.com';

describe('Fetcher Class', () => {
  let fetcher: Fetcher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue(new Response());
    vi.stubGlobal('fetch', mockFetch);
    fetcher = new Fetcher(BASE_URL, 5000);
  });

  describe('get', () => {
    it('GET 메서드로 요청한다', async () => {
      await fetcher.get('/path');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('query 파라미터가 있으면 URL에 포함된다', async () => {
      await fetcher.get('/path', { page: 1 });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.anything()
      );
    });
  });

  describe('post', () => {
    it('POST 메서드로 body를 포함하여 요청한다', async () => {
      await fetcher.post('/path', { key: 'value' });
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ key: 'value' }),
        })
      );
    });

    it('data 없이 요청하면 body가 undefined로 요청이 간다', async () => {
      await fetcher.post('/path');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({ method: 'POST', body: undefined })
      );
    });
  });

  describe('delete', () => {
    it('DELETE 메서드로 요청한다', async () => {
      await fetcher.delete('/path');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('data와 함께 요청하면 body를 포함한다', async () => {
      await fetcher.delete('/path', { id: 1 });
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({ body: JSON.stringify({ id: 1 }) })
      );
    });
  });

  describe('put', () => {
    it('PUT 메서드로 body를 포함하여 요청한다', async () => {
      await fetcher.put('/path', { key: 'value' });
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({
          method: 'put',
          body: JSON.stringify({ key: 'value' }),
        })
      );
    });

    it('data 없이 요청하면 body가 undefined로 요청이 간다', async () => {
      await fetcher.put('/path');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({ method: 'put', body: undefined })
      );
    });
  });

  describe('에러 처리', () => {
    it('fetch가 실패하면 에러를 그대로 던진다', async () => {
      mockFetch.mockRejectedValue(new Error('Network Error'));
      await expect(fetcher.get('/path')).rejects.toThrow('Network Error');
    });

    it('타임아웃이 초과되면 요청을 중단한다', async () => {
      vi.useFakeTimers();
      mockFetch.mockImplementation((_url, options) => {
        return new Promise((_, reject) => {
          options?.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        });
      });

      const promise = fetcher.get('/path');
      vi.advanceTimersByTime(5000);

      await expect(promise).rejects.toThrow('The operation was aborted.');
    });

    afterEach(() => {
      vi.useRealTimers();
    });
  });

  describe('patch', () => {
    it('PATCH 메서드로 body를 포함하여 요청한다', async () => {
      await fetcher.patch('/path', { key: 'value' });
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({
          method: 'patch',
          body: JSON.stringify({ key: 'value' }),
        })
      );
    });

    it('data 없이 요청하면 body가 undefined로 요청이 간다', async () => {
      await fetcher.patch('/path');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE_URL}/path`,
        expect.objectContaining({ method: 'patch', body: undefined })
      );
    });
  });
});
