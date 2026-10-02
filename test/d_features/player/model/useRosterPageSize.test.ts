/**
 * useRosterPageSize 훅 단위 테스트(ST-006, A-2/A-8/S-11/S-12, D-11/decision-1 개정).
 *
 * 검증 목적:
 * - 뷰포트 폭별 페이지 크기가 리터럴로 단언된다(S-16) — 1100px·980px 경계 양쪽 모두 포함
 * - setViewportWidth로 뷰포트가 전환되면 페이지 크기가 실제로 갱신된다
 * - 언마운트 시 두 MediaQueryList 모두 removeEventListener가 호출된다(구독 해제)
 * - 정렬 계약(S-11): 문자열 포함이 아니라 클래스 문자열에서 파싱한 열 티어와 훅이 반환한
 *   페이지 크기로 `카드 수 % 열 수 === 0`을 전 경계(±1 포함)에서 단언한다. 클래스에 `max-[`가
 *   있으면 즉시 실패시킨다 — 경계 의미론이 min-width로 통일돼 있다는 전제를 가정하지 않고
 *   확인한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import {
  installMatchMedia,
  restoreMatchMedia,
  setViewportWidth,
} from '@test/fixtures/matchMedia';
import { ROSTER_GRID_CLASSNAME } from '@entities/player/ui';

import { useRosterPageSize } from '@features/player/model/useRosterPageSize';

afterEach(restoreMatchMedia);

/**
 * ROSTER_GRID_CLASSNAME → 열 티어. `min-[Npx]:grid-cols-M`은 표준 min-width(N 포함)이고
 * 접두사 없는 `grid-cols-M`이 base(minWidth 0)다.
 * max-[] 변형이 하나라도 있으면 이 파서의 전제가 깨지므로 즉시 실패시킨다 — Tailwind v4는
 * max-[Npx]를 `not all and (min-width:Npx)`로 컴파일해 N을 배제한다(D-11, decision-1).
 */
const parseColumnTiers = (className: string): { minWidth: number; columns: number }[] => {
  if (className.includes('max-[')) {
    throw new Error('ROSTER_GRID_CLASSNAME에 max-[] 변형이 있다 — 경계 의미론이 min-width가 아니다(D-11).');
  }

  const tiers: { minWidth: number; columns: number }[] = [];

  for (const token of className.split(/\s+/)) {
    const base = /^grid-cols-(\d+)$/.exec(token);
    if (base?.[1]) {
      tiers.push({ minWidth: 0, columns: Number(base[1]) });
      continue;
    }

    const scoped = /^min-\[(\d+)px\]:grid-cols-(\d+)$/.exec(token);
    if (scoped?.[1] && scoped[2]) {
      tiers.push({ minWidth: Number(scoped[1]), columns: Number(scoped[2]) });
    }
  }

  return tiers.toSorted((a, b) => a.minWidth - b.minWidth);
};

const columnsAt = (width: number): number => {
  const applicable = parseColumnTiers(ROSTER_GRID_CLASSNAME).filter((tier) => width >= tier.minWidth);
  const matched = applicable.at(-1);
  if (!matched) throw new Error(`폭 ${width}px에 적용되는 열 티어가 없다.`);
  return matched.columns;
};

const pageSizeAt = (width: number): number => {
  installMatchMedia(width);
  const { result, unmount } = renderHook(() => useRosterPageSize());
  const pageSize = result.current;
  unmount();
  restoreMatchMedia();
  return pageSize;
};

describe('useRosterPageSize', () => {
  it.each([
    [1440, 10, 5, 2],
    [1100, 10, 5, 2],
    [1099, 8, 4, 2],
    [980, 8, 4, 2],
    [979, 6, 3, 2],
    [620, 6, 3, 2],
    [619, 6, 2, 3],
    [320, 6, 2, 3],
  ])('폭 %ipx — 카드 %i장 / %i열 / %i행(D-1)', (width, pageSize, columns, rows) => {
    expect(pageSizeAt(width)).toBe(pageSize);
    expect(columnsAt(width)).toBe(columns);
    expect(pageSize / columns).toBe(rows);
  });

  it('뷰포트가 1200px에서 620px로 전환되면 페이지 크기가 10에서 6으로 갱신된다', () => {
    installMatchMedia(1200);
    const { result } = renderHook(() => useRosterPageSize());

    expect(result.current).toBe(10);

    act(() => setViewportWidth(620));

    expect(result.current).toBe(6);
  });

  it('언마운트 시 두 MediaQueryList 모두 removeEventListener가 호출된다', () => {
    installMatchMedia(1200);
    const { unmount } = renderHook(() => useRosterPageSize());

    // installMatchMedia는 쿼리 문자열별로 MediaQueryList를 싱글턴 캐시하므로, 여기서 다시
    // window.matchMedia(query)를 호출해도 훅이 subscribe에서 구독한 것과 같은 인스턴스가 온다.
    const desktopQuery = window.matchMedia('(min-width: 1100px)');
    const tabletQuery = window.matchMedia('(min-width: 980px)');

    unmount();

    expect(desktopQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
    expect(tabletQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('RosterGrid 열 티어가 리터럴 표와 정확히 일치한다(S-11)', () => {
    expect(parseColumnTiers(ROSTER_GRID_CLASSNAME)).toEqual([
      { minWidth: 0, columns: 2 },
      { minWidth: 620, columns: 3 },
      { minWidth: 980, columns: 4 },
      { minWidth: 1100, columns: 5 },
    ]);
  });

  it.each([[320], [619], [620], [621], [768], [979], [980], [981], [1099], [1100], [1101], [1440]])(
    '폭 %ipx에서 카드 수가 열 수로 나누어떨어진다 — 잘린 행 0(D-11)',
    (width) => {
      expect(pageSizeAt(width) % columnsAt(width)).toBe(0);
    },
  );

  it('페이지 크기 전환점(980·1100)은 모두 열 전환점이기도 하다(S-11)', () => {
    const tierWidths = new Set(parseColumnTiers(ROSTER_GRID_CLASSNAME).map((tier) => tier.minWidth));

    for (const boundary of [980, 1100]) {
      expect(tierWidths.has(boundary)).toBe(true);
      expect(pageSizeAt(boundary)).not.toBe(pageSizeAt(boundary - 1));
    }
  });
});
