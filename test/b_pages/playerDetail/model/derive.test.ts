/**
 * model/derive.ts 단위테스트.
 *
 * 필수 시나리오(plan.json ST-001):
 * - 시즌 합계(deriveSeasonRows) = 통산(career) 불변식 — 전 mock 선수 전수 검증
 * - GK / 은퇴 / 레전드 분기(deriveCurrentSeason)
 * - getAttrLevel 경계값(80·65)
 */

import { describe, expect, it } from 'vitest';

import {
  deriveCurrentSeason,
  deriveSeasonRows,
  getAttrLevel,
} from '@pages/playerDetail/model/derive';
import { players } from '@pages/playerDetail/model/mockData';
import type { PlayerDetail } from '@pages/playerDetail/model/types';

function sumSeasonRows(rows: ReturnType<typeof deriveSeasonRows>) {
  return rows.reduce(
    (acc, row) => ({
      apps: acc.apps + row.apps,
      goals: acc.goals + row.goals,
      assists: acc.assists + row.assists,
    }),
    { apps: 0, goals: 0, assists: 0 }
  );
}

function findPlayer(id: string): PlayerDetail {
  const player = players.find((p) => p.id === id);
  if (!player) throw new Error(`Match player not found: ${id}`);
  return player;
}

describe('deriveSeasonRows', () => {
  it.each(players.map((p) => [p.id, p] as const))(
    '%s — 시즌 행 합계가 통산(career) 스탯과 정확히 일치한다',
    (_id, player) => {
      const rows = deriveSeasonRows(player);
      expect(sumSeasonRows(rows)).toEqual(player.career);
    }
  );

  it('모든 시즌 행의 apps/goals/assists는 음수가 아니다', () => {
    for (const player of players) {
      for (const row of deriveSeasonRows(player)) {
        expect(row.apps).toBeGreaterThanOrEqual(0);
        expect(row.goals).toBeGreaterThanOrEqual(0);
        expect(row.assists).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('같은 선수에 대해 항상 같은 결과를 반환한다 (순수 함수 — Math.random 미사용)', () => {
    const bruno = findPlayer('bruno');
    expect(deriveSeasonRows(bruno)).toEqual(deriveSeasonRows(bruno));
  });

  it('시즌 수는 최대 8개로 캡핑된다 (예: 963경기·24시즌 커리어의 giggs)', () => {
    const giggs = findPlayer('giggs');
    expect(deriveSeasonRows(giggs)).toHaveLength(8);
  });

  it('시즌 레이블은 "시작연도/다음연도 뒤 2자리" 형식이다', () => {
    const deligt = findPlayer('deligt'); // years: "2024–현재"
    const rows = deriveSeasonRows(deligt);
    expect(rows[0]?.season).toBe('2024/25');
    expect(rows.at(-1)?.season).toBe('2025/26');
  });
});

describe('deriveCurrentSeason', () => {
  it('현역 필드 플레이어는 retired=false, title="현재 시즌", szn="2025/26"', () => {
    const snapshot = deriveCurrentSeason(findPlayer('bruno'));
    expect(snapshot.retired).toBe(false);
    expect(snapshot.title).toBe('현재 시즌');
    expect(snapshot.szn).toBe('2025/26');
  });

  it('은퇴 선수는 retired=true, title="마지막 시즌", szn=은퇴 직전 시즌', () => {
    const snapshot = deriveCurrentSeason(findPlayer('rooney')); // years: "2004–2017"
    expect(snapshot.retired).toBe(true);
    expect(snapshot.title).toBe('마지막 시즌');
    expect(snapshot.szn).toBe('2016/17');
  });

  it('레전드(legend=true)도 은퇴 선수와 동일하게 retired 분기를 탄다', () => {
    const giggs = findPlayer('giggs');
    expect(giggs.legend).toBe(true);
    expect(deriveCurrentSeason(giggs).retired).toBe(true);
  });

  it('GK(onana)도 필드 플레이어와 동일한 스냅샷 형태를 반환한다 (apps/goals/assists)', () => {
    const onana = findPlayer('onana');
    expect(onana.pos).toBe('GK');
    const snapshot = deriveCurrentSeason(onana);
    expect(snapshot).toEqual(
      expect.objectContaining({
        apps: expect.any(Number),
        goals: expect.any(Number),
        assists: expect.any(Number),
      })
    );
  });

  it('apps는 1 이상 38 이하로 클램프된다', () => {
    for (const player of players) {
      const { apps } = deriveCurrentSeason(player);
      expect(apps).toBeGreaterThanOrEqual(1);
      expect(apps).toBeLessThanOrEqual(38);
    }
  });
});

describe('getAttrLevel', () => {
  it('80 이상이면 high', () => {
    expect(getAttrLevel(80)).toBe('high');
    expect(getAttrLevel(100)).toBe('high');
  });

  it('79는 high가 아니라 mid — 80 경계값 하한 확인', () => {
    expect(getAttrLevel(79)).toBe('mid');
  });

  it('65 이상 80 미만이면 mid', () => {
    expect(getAttrLevel(65)).toBe('mid');
    expect(getAttrLevel(79)).toBe('mid');
  });

  it('64는 mid가 아니라 low — 65 경계값 하한 확인', () => {
    expect(getAttrLevel(64)).toBe('low');
  });

  it('65 미만이면 low', () => {
    expect(getAttrLevel(0)).toBe('low');
    expect(getAttrLevel(64)).toBe('low');
  });
});
