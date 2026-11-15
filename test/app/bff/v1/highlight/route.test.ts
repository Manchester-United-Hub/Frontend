import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

import { GET } from '@app/bff/v1/highlight/route';
import { fetchHighlightList } from '@entities/highlight/api/server';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@entities/highlight/api/server', () => ({
  fetchHighlightList: vi.fn(),
}));

const LIST_DTO = buildHighlightListDTO([buildHighlightDTO()]);

const requestWith = (search: string) =>
  new NextRequest(`http://localhost/bff/v1/highlight${search}`);

describe('GET /bff/v1/highlight', () => {
  beforeEach(() => vi.clearAllMocks());

  it('season·size를 숫자로 바꿔 fetchHighlightList를 호출하고 BFF 봉투로 응답한다', async () => {
    vi.mocked(fetchHighlightList).mockResolvedValue({ isSuccess: true, status: 200, data: LIST_DTO });

    const response = await GET(requestWith('?season=2026&size=100'));

    expect(fetchHighlightList).toHaveBeenCalledWith({ season: 2026, size: 100 });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, data: LIST_DTO, error: null });
  });

  it('sort·page도 계약 값이면 그대로 전달한다', async () => {
    vi.mocked(fetchHighlightList).mockResolvedValue({ isSuccess: true, status: 200, data: LIST_DTO });

    await GET(requestWith('?season=2026&sort=VIEW_COUNT&page=1&size=9'));

    expect(fetchHighlightList).toHaveBeenCalledWith({
      season: 2026,
      sort: 'VIEW_COUNT',
      page: 1,
      size: 9,
    });
  });

  it.each([
    ['season 누락', '?size=100'],
    ['정수가 아닌 season', '?season=0x7EA'],
    ['size 상한 초과', '?season=2026&size=101'],
    ['계약에 없는 sort', '?season=2026&sort=OLDEST'],
  ])('%s이면 백엔드를 호출하지 않고 422 INVALID_QUERY로 거절한다', async (_, search) => {
    const response = await GET(requestWith(search));

    expect(response.status).toBe(422);
    expect(fetchHighlightList).not.toHaveBeenCalled();
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INVALID_QUERY');
  });

  it('백엔드 실패 상태와 에러 본문을 그대로 전달한다', async () => {
    const error = { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' };
    vi.mocked(fetchHighlightList).mockResolvedValue({ isSuccess: false, status: 500, data: error });

    const response = await GET(requestWith('?season=2026'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ success: false, data: null, error });
  });
});
