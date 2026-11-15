import { describe, it, expect, vi, beforeEach } from 'vitest';

import { serverFetcher } from '@shared/api';
import { fetchHighlightList } from '@entities/highlight/api/server/highlightList';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

const query = { season: 2026, size: 100 };
const listDTO = buildHighlightListDTO([buildHighlightDTO()]);

const mockResponse = (ok: boolean, status: number, data: unknown) => {
  vi.mocked(serverFetcher.get).mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response);
};

describe('fetchHighlightList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/highlights 경로로 query 파라미터와 함께 GET 요청한다', async () => {
    mockResponse(true, 200, listDTO);

    await fetchHighlightList(query);

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/highlights', query);
  });

  it('계약에 맞는 응답을 ServerApiResult 성공으로 반환한다', async () => {
    mockResponse(true, 200, listDTO);

    const result = await fetchHighlightList(query);

    expect(result).toEqual({ isSuccess: true, status: 200, data: listDTO });
  });

  it('조회수 비공개 영상(viewCount 0)도 계약에 맞는 응답으로 받는다', async () => {
    mockResponse(true, 200, buildHighlightListDTO([buildHighlightDTO({ viewCount: 0 })]));

    const result = await fetchHighlightList(query);

    expect(result.isSuccess).toBe(true);
  });

  it('계약과 다른 응답은 502 UPSTREAM_CONTRACT_MISMATCH로 반환한다', async () => {
    mockResponse(true, 200, { ...listDTO, highlights: [{ videoId: 'x' }] });

    const result = await fetchHighlightList(query);

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(502);
    expect(result.data).toMatchObject({ code: 'UPSTREAM_CONTRACT_MISMATCH' });
  });

  it('백엔드 에러는 상태코드와 에러 본문을 그대로 반환한다', async () => {
    const errorData = { code: 'MISSING_REQUEST_PARAMETER_ERROR', message: '필수 요청 파라미터가 누락되었습니다.' };
    mockResponse(false, 400, errorData);

    const result = await fetchHighlightList(query);

    expect(result).toEqual({ isSuccess: false, status: 400, data: errorData });
  });
});
