/**
 * getPlayerRoster 단위 테스트 — getStandings.test.ts·getSeasonInfo.test.ts와 동일한 실측 사유.
 *
 * 'use cache'는 vitest(esbuild) 환경에서 무시되는 문자열 리터럴이라 캐시 계층
 * (readPlayerRosterCached)이 캐시 히트 없이 매번 평범한 함수로 실행된다. 이 성질을
 * 이용해 "캐시 실패 → 복구 경로(readPlayerRosterFresh)" 전이를 fetchPlayerList 호출
 * 횟수로 검증한다. 캐시 히트/미스 자체는 이 파일로 검증할 수 없다 — 그 검증은 ST-007의
 * next build/start 런타임 실측이 담당한다(S-16).
 *
 * next/cache의 cacheLife는 mock한다: cacheLife()는 진짜 next 런타임 함수라 실제 호출되고,
 * cacheComponents config가 꺼진 vitest 컨텍스트에서는 E887을 던진다. 이 호출은 캐시 계층
 * try 블록 안에 있어 내부 try/catch에 잡히지만, mock 없이 두면 모든 테스트가 매번 복구
 * 경로를 타 호출 횟수·경고 로그 단언이 무의미해진다. src/ 변경 아님.
 *
 * cache()는 렌더 컨텍스트가 없는 vitest에서 메모이즈 없이 원함수를 그대로 호출하므로
 * (getStandings.test.ts 실측 근거와 동일) 호출 횟수 단언이 왜곡되지 않는다.
 *
 * 기대값([season-cache-recovery])은 대상 모듈의 상수를 import하지 않고 리터럴로 쓴다(S-16).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getPlayerRoster } from '@features/player/api/getPlayerRoster';
import { fetchPlayerList } from '@entities/player/api/server';
import type { PlayerListQueryDTO } from '@entities/player/model';
import type { ServerApiResult } from '@shared/model';
import type { PlyaerListDTO } from '@entities/player/model';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@entities/player/api/server', () => ({
  fetchPlayerList: vi.fn(),
}));

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

const QUERY: PlayerListQueryDTO = { season: 2026, size: 100 };

const successResult = (data: PlyaerListDTO): ServerApiResult<PlyaerListDTO> => ({
  isSuccess: true,
  status: 200,
  data,
});

const failureResult = (): ServerApiResult<PlyaerListDTO> => ({
  isSuccess: false,
  status: 502,
  data: { code: 'UPSTREAM_ERROR', message: '업스트림 오류' },
});

describe('getPlayerRoster', () => {
  beforeEach(() => {
    vi.mocked(fetchPlayerList).mockReset();
  });

  it('조회가 성공하면 응답을 그대로 반환하고 fetchPlayerList는 같은 query로 1회만 호출된다(복구 경로 미진입)', async () => {
    const dto = buildPlayerListDTO([buildPlayerDTO()]);
    vi.mocked(fetchPlayerList).mockResolvedValue(successResult(dto));

    const roster = await getPlayerRoster(QUERY);

    expect(roster).toEqual(dto);
    expect(fetchPlayerList).toHaveBeenCalledTimes(1);
    expect(fetchPlayerList).toHaveBeenCalledWith(QUERY);
  });

  it('1차 조회가 실패하고 2차(복구) 조회가 성공하면 복구 값을 반환하고 fetchPlayerList는 2회 호출된다', async () => {
    const recoveredDto = buildPlayerListDTO([buildPlayerDTO({ id: 99 })]);
    vi.mocked(fetchPlayerList)
      .mockResolvedValueOnce(failureResult())
      .mockResolvedValueOnce(successResult(recoveredDto));

    const roster = await getPlayerRoster(QUERY);

    expect(roster).toEqual(recoveredDto);
    expect(fetchPlayerList).toHaveBeenCalledTimes(2);
    expect(fetchPlayerList).toHaveBeenNthCalledWith(1, QUERY);
    expect(fetchPlayerList).toHaveBeenNthCalledWith(2, QUERY);
  });

  it('1차·2차 모두 실패하면 null을 반환하고 throw하지 않으며 console.warn이 [season-cache-recovery]로 1회 호출된다', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(fetchPlayerList).mockResolvedValue(failureResult());

    await expect(getPlayerRoster(QUERY)).resolves.toBeNull();
    expect(fetchPlayerList).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toMatch(/^\[season-cache-recovery\]/);

    warnSpy.mockRestore();
  });

  it('fetchPlayerList가 예외를 던져도 null을 반환하고 throw하지 않는다', async () => {
    vi.mocked(fetchPlayerList).mockRejectedValue(new Error('network down'));

    await expect(getPlayerRoster(QUERY)).resolves.toBeNull();
    expect(fetchPlayerList).toHaveBeenCalledTimes(2);
  });
});
