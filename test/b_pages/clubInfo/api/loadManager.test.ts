import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchCoach } from '@entities/coach/api/server';
import { loadManager } from '@pages/clubInfo/api/loadManager';
import { COACH_DTO_FIXTURE, MANAGER_FIXTURE } from '@test/fixtures/coach';

vi.mock('@entities/coach/api/server', () => ({ fetchCoach: vi.fn() }));

describe('loadManager', () => {
  beforeEach(() => vi.clearAllMocks());

  it('맨체스터 유나이티드(33) 감독을 조회해 화면 모델로 반환한다', async () => {
    vi.mocked(fetchCoach).mockResolvedValue({ isSuccess: true, status: 200, data: COACH_DTO_FIXTURE });

    const manager = await loadManager();

    expect(fetchCoach).toHaveBeenCalledWith(33);
    expect(manager).toEqual(MANAGER_FIXTURE);
  });

  it('API가 실패 응답을 주면 null을 반환한다', async () => {
    vi.mocked(fetchCoach).mockResolvedValue({
      isSuccess: false,
      status: 502,
      data: { code: 'UPSTREAM_CONTRACT_MISMATCH', message: 'mismatch' },
    });

    expect(await loadManager()).toBeNull();
  });

  it('조회 중 예외(타임아웃 등)가 나도 throw하지 않고 null을 반환한다', async () => {
    vi.mocked(fetchCoach).mockRejectedValue(new Error('timeout'));

    expect(await loadManager()).toBeNull();
  });
});
