import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchPlayerList } from '@entities/player/api/server';
import { BASE_PLAYER_DTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@entities/player/api/server', () => ({
  fetchPlayerList: vi.fn(),
}));

vi.mock('@shared/model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/model')>();
  return { ...actual, toBffResponse: vi.fn((result) => result) };
});

const listDTO = buildPlayerListDTO([BASE_PLAYER_DTO]);

const callRoute = async (url: string) => {
  const { GET } = await import('@app/api/v1/player/route');
  return await GET(new NextRequest(url));
};

describe('GET /api/v1/player', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchPlayerList).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: listDTO,
    });
  });

  it('season·page·size를 파싱해 fetchPlayerList를 호출한다', async () => {
    await callRoute('http://localhost/api/v1/player?season=2024&page=1&size=50');

    expect(fetchPlayerList).toHaveBeenCalledWith({ season: 2024, page: 1, size: 50 });
  });

  it('쿼리가 없으면 모든 파라미터를 생략한다(전부 선택 파라미터)', async () => {
    await callRoute('http://localhost/api/v1/player');

    expect(fetchPlayerList).toHaveBeenCalledWith({
      season: undefined,
      page: undefined,
      size: undefined,
    });
  });

  it.each([
    ['정수 표기가 아닌 season', 'season=0x7EA'],
    ['음수 page', 'page=-1'],
    ['숫자가 아닌 size', 'size=abc'],
    ['상한을 넘는 size', 'size=101'],
  ])('계약을 벗어난 쿼리(%s)는 422로 거절하고 업스트림을 호출하지 않는다', async (_label, query) => {
    const response = await callRoute(`http://localhost/api/v1/player?${query}`);

    expect(response.status).toBe(422);
    expect(fetchPlayerList).not.toHaveBeenCalled();
  });

  it('200 응답을 반환한다', async () => {
    const response = await callRoute('http://localhost/api/v1/player?season=2024');

    expect(response.status).toBe(200);
  });
});
