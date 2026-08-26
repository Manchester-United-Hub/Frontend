/**
 * SquadPitch 방어 분기 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 검증 목적: tokens(좌표) 개수가 lineup(선수) 개수보다 많을 때 `lineup[index]`가
 * undefined인 초과 토큰이 크래시 없이 조용히 스킵되는가(SquadPitch.tsx:50
 * `if (!player) return null;` 미도달 분기).
 *
 * 토큰 조회: PitchToken 래퍼 div만 인라인 style="left:...;top:..."을 갖는다
 * (SquadTab.test.tsx의 선례를 따름).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SquadPitch } from '@pages/clubInfo/ui/SquadTab/SquadPitch';
import { FORMATIONS } from '@pages/clubInfo/model/formations';
import { lineup } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

function pitchTokens(container: HTMLElement) {
  return container.querySelectorAll('div[style*="left:"]');
}

describe('SquadPitch 방어 분기 — tokens가 lineup보다 많을 때', () => {
  it('lineup[index]가 없는 초과 토큰은 크래시 없이 스킵되고, 남은 인원만 렌더된다', () => {
    const tokens = FORMATIONS['4-3-3']; // 좌표 11개
    const shortLineup = lineup.slice(0, 9); // 선수 9명만 공급 (2명 부족)

    let container!: HTMLElement;
    expect(() => {
      container = render(<SquadPitch tokens={tokens} lineup={shortLineup} />).container;
    }).not.toThrow();
    expect(pitchTokens(container)).toHaveLength(9);
  });

  it('lineup이 완전히 비어 있어도(전원 초과) 예외 없이 토큰 0개로 렌더된다', () => {
    const tokens = FORMATIONS['4-4-2'];
    const { container } = render(<SquadPitch tokens={tokens} lineup={[]} />);
    expect(pitchTokens(container)).toHaveLength(0);
  });
});
