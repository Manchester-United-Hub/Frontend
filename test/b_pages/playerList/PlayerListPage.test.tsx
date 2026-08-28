/**
 * PlayerListPage 테스트 — 위젯 병합 계약(ST-4) + season prop 배선(ST-005/S-9).
 *
 * ST-4로 데이터 조회·필터·상호작용 로직 전부가 c_widgets/PlayerRoster의 RosterPanel로
 * 옮겨졌다(그 커버리지는 test/c_widgets/PlayerRoster/ui/RosterPanel.test.tsx가 담당). 이
 * 페이지는 RosterHeadSection·RosterPanel을 병합하기만 하므로, 이 테스트는 그 배선만
 * 검증한다 — StandingsPanel.test.tsx 선례(S2-13)처럼 element.type만 단언하고 이미 자기
 * 테스트를 가진 자식(RosterHeadSection·RosterPanel)을 다시 렌더하지 않는다.
 *
 * ST-005로 season이 app/players/page.tsx(서버, getSeasonInfo())에서 확정돼 이 페이지를 거쳐
 * RosterPanel로 prop 전달된다(A-4/S-9) — 이 페이지·RosterPanel 어디에서도 useCurrentSeason()을
 * 호출하지 않는다.
 *
 * 검증 목적:
 * - <main> 안에 RosterHeadSection과 RosterPanel이 이 순서로 배선되는가
 * - RosterHeadSection은 헤더 전용 Shell을 자체 소유(RosterHeadSection 내부 소관)하고,
 *   RosterPanel은 이 페이지가 소유하는 별도의 공유 Shell 안에서 렌더되는가(Shell 인스턴스
 *   분리 구조, ST-3A 인계)
 * - season prop이 그대로 RosterPanel에 전달되는가
 */

import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';

import { PlayerListPage } from '@pages/playerList';
import { RosterHeadSection, RosterPanel } from '@widgets/PlayerRoster/ui';
import { Shell } from '@shared/ui';

const TEST_SEASON = 2026;

describe('PlayerListPage', () => {
  it('<main> 안에 RosterHeadSection과, 공유 Shell로 감싼 RosterPanel을 이 순서로 배선하고 season을 전달한다', () => {
    const element = PlayerListPage({ season: TEST_SEASON });

    expect(element.type).toBe('main');

    const children = element.props.children as unknown as ReactElement[];
    expect(children).toHaveLength(2);

    const [headSection, shellWrapped] = children;
    expect(headSection.type).toBe(RosterHeadSection);

    expect(shellWrapped.type).toBe(Shell);
    const shellChild = shellWrapped.props as unknown as { children: ReactElement };
    expect(shellChild.children.type).toBe(RosterPanel);
    expect((shellChild.children.props as { season: number }).season).toBe(TEST_SEASON);
  });
});
