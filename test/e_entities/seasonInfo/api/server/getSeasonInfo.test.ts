/**
 * getSeasonInfo 단위 테스트 (decision-1.md §5 ST-09 재정의 — 이 파일이 정본).
 *
 * 'use cache'는 vitest(esbuild) 환경에서 무시되는 문자열 리터럴이라 캐시 계층
 * (readCurrentSeasonCached)이 캐시 히트 없이 매번 평범한 함수로 실행된다. 이 성질을
 * 이용해 "캐시 실패 → 복구 경로(readCurrentSeasonFresh)" 전이를 getCurrentSeason
 * 호출 횟수로 검증한다. 캐시 히트/미스 자체는 이 파일로 검증할 수 없다 — 그 검증은
 * ST-01·ST-05의 next build/start 런타임 실측이 담당한다(S-16).
 *
 * next/cache의 cacheLife는 mock한다(실측 확인 — decision-1.md에는 명시돼 있지 않던
 * 사실이라 여기 기록한다): 'use cache' 디렉티브 자체는 esbuild가 무시하지만,
 * cacheLife()는 진짜 next 런타임 함수라서 실제로 호출되며, Next 16의 cacheLife는
 * `cacheComponents` config가 꺼진 컨텍스트(= vitest, 실제 페이지 렌더가 아님)에서
 * 호출되면 `E887` 에러를 던진다. decision-2.md H-1 수정 이후 이 호출은
 * readCurrentSeasonCached의 try 블록 **안**에 있어 내부 try/catch에 잡힌다 — 그러나
 * mock 없이 두면 모든 테스트가 매번 (E887 throw → catch → { ok: false } →) 복구
 * 경로를 타게 되어, 정상/실패 분기를 구분해 검증하려는 호출 횟수·경고 로그 단언이
 * 전부 무의미해진다. 그래서 캐시 계층의 실패 처리 로직과 무관한 이 잡음을 여전히
 * next/cache 전체 mock으로 제거한다. src/ 변경은 아니다.
 *
 * 기대값(2026·'2026-27'·'upcoming'·'[season-cache-recovery]')은 대상 모듈의 상수를
 * import하지 않고 리터럴로 쓴다. 상수를 import해 기대값을 계산하면 그 상수 자체가
 * 검증되지 않기 때문이다(decision-1.md §5 명시 주의사항).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getSeasonInfo } from '@entities/seasonInfo/api/server/getSeasonInfo';
import { getCurrentSeason } from '@entities/seasonInfo/api/server/fetchCurrentSeason';
import type { CurrentSeasonDTO } from '@entities/seasonInfo/model';
import type { ServerApiResult } from '@shared/model';

vi.mock('@entities/seasonInfo/api/server/fetchCurrentSeason', () => ({
  getCurrentSeason: vi.fn(),
}));

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

const successResult = (
  data: CurrentSeasonDTO
): ServerApiResult<CurrentSeasonDTO> => ({
  isSuccess: true,
  status: 200,
  data,
});

const failureResult = (): ServerApiResult<CurrentSeasonDTO> => ({
  isSuccess: false,
  status: 502,
  data: { code: 'UPSTREAM_ERROR', message: '업스트림 오류' },
});

describe('getSeasonInfo', () => {
  beforeEach(() => {
    vi.mocked(getCurrentSeason).mockReset();
  });

  it('캐시 조회가 성공하면 startYear·label·status를 매핑해 반환하고 getCurrentSeason은 1회만 호출된다(복구 경로 미진입)', async () => {
    vi.mocked(getCurrentSeason).mockResolvedValue(
      successResult({ season: 2030, started: true })
    );

    const info = await getSeasonInfo();

    expect(info).toEqual({
      startYear: 2030,
      label: '2030-31',
      status: 'ongoing',
    });
    expect(getCurrentSeason).toHaveBeenCalledTimes(1);
  });

  it('1차 조회가 실패하고 2차(복구) 조회가 성공하면 복구 경로의 값을 반환하고 getCurrentSeason은 2회 호출된다', async () => {
    vi.mocked(getCurrentSeason)
      .mockResolvedValueOnce(failureResult())
      .mockResolvedValueOnce(successResult({ season: 2031, started: false }));

    const info = await getSeasonInfo();

    expect(info).toEqual({
      startYear: 2031,
      label: '2031-32',
      status: 'upcoming',
    });
    expect(getCurrentSeason).toHaveBeenCalledTimes(2);
  });

  it('1차·2차 모두 실패하면 폴백(2026/upcoming)을 반환하고 호출은 2회이며 throw하지 않는다', async () => {
    vi.mocked(getCurrentSeason).mockResolvedValue(failureResult());

    await expect(getSeasonInfo()).resolves.toEqual({
      startYear: 2026,
      label: '2026-27',
      status: 'upcoming',
    });
    expect(getCurrentSeason).toHaveBeenCalledTimes(2);
  });

  it('getCurrentSeason이 예외를 던져도 폴백을 반환하고 throw하지 않는다(S-3a — 캐시·복구 계층 각각의 내부 try/catch)', async () => {
    vi.mocked(getCurrentSeason).mockRejectedValue(new Error('network down'));

    await expect(getSeasonInfo()).resolves.toEqual({
      startYear: 2026,
      label: '2026-27',
      status: 'upcoming',
    });
    expect(getCurrentSeason).toHaveBeenCalledTimes(2);
  });

  it('복구 경로 진입 시 console.warn이 [season-cache-recovery]로 시작하는 인자와 함께 호출된다(R-3b 관측 훅)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(getCurrentSeason)
      .mockResolvedValueOnce(failureResult())
      .mockResolvedValueOnce(successResult({ season: 2031, started: false }));

    await getSeasonInfo();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/^\[season-cache-recovery\]/);

    warnSpy.mockRestore();
  });
});
