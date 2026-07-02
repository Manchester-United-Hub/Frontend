/**
 * SquadTab 포메이션 전환 테스트 — QA 검증(qa-clubInfo).
 *
 * 검증 목적:
 * - 포메이션 4종 전환 시 세그먼트 컨트롤의 aria-pressed 갱신
 * - 피치 토큰 좌표가 FORMATIONS[name][i] ↔ lineup[i] 인덱스 페어링대로 재배치되는가
 * - GK(lineup[0])가 항상 formations 테이블의 index 0(스폿)에 페어링되는가(11명 전원)
 *
 * 토큰 조회: PitchToken 래퍼 div만 인라인 style="left:...;top:..."을 갖는다(LineupList 행은
 * Tailwind 클래스만 사용, 인라인 style 없음) — 'div[style*="left:"]' 선택자로 피치 토큰만 스코프.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { SquadTab } from '@pages/clubInfo/ui/SquadTab';
import { FORMATIONS, FORMATION_NAMES } from '@pages/clubInfo/model/formations';
import { lineup } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

function pitchTokens(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLDivElement>('div[style*="left:"]'));
}

/**
 * 번호로 토큰을 찾는다. 주의: textContent substring 매칭("4" ⊂ "24")은 오탐을 유발하므로
 * 반드시 등번호 배지 span의 "정확한" 텍스트("4" === "4")로 비교한다.
 */
function findTokenByNum(tokens: HTMLDivElement[], num: number) {
  return tokens.find((t) => t.querySelector('span')?.textContent === String(num));
}

describe('SquadTab 포메이션 전환', () => {
  it('기본 포메이션은 4-3-3 — 세그먼트 컨트롤 aria-pressed 초기값', () => {
    render(<SquadTab />);
    expect(screen.getByRole('button', { name: '4-3-3' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '4-4-2' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('피치 토큰 11개가 렌더되고, GK(오나나 #24)는 formations 테이블 index 0 좌표에 위치한다', () => {
    const { container } = render(<SquadTab />);
    const tokens = pitchTokens(container);
    expect(tokens).toHaveLength(11);

    const gkCoord = FORMATIONS['4-3-3'][0];
    const gkToken = findTokenByNum(tokens, 24);
    expect(gkToken).toBeDefined();
    expect(gkToken).toHaveStyle({ left: `${gkCoord.x}%`, top: `${gkCoord.y}%` });
  });

  it.each(FORMATION_NAMES)(
    '%s 전환 시 라인업 11명 전원이 해당 포메이션 좌표로 정확히 재배치된다(인덱스 페어링)',
    async (name) => {
      const user = userEvent.setup();
      const { container } = render(<SquadTab />);

      await user.click(screen.getByRole('button', { name }));
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'true');

      const tokens = pitchTokens(container);
      expect(tokens).toHaveLength(11);

      const coords = FORMATIONS[name];
      lineup.forEach((player, i) => {
        const token = findTokenByNum(tokens, player.num);
        expect(token, `token for #${player.num} (${player.en}) not found`).toBeDefined();
        expect(token).toHaveStyle({ left: `${coords[i].x}%`, top: `${coords[i].y}%` });
      });
    },
  );

  it('4-4-2로 전환 후 다시 4-3-3으로 돌아오면 좌표가 원상 복구된다(연속 동작 일관성)', async () => {
    const user = userEvent.setup();
    const { container } = render(<SquadTab />);

    await user.click(screen.getByRole('button', { name: '4-4-2' }));
    await user.click(screen.getByRole('button', { name: '4-3-3' }));

    expect(screen.getByRole('button', { name: '4-3-3' })).toHaveAttribute('aria-pressed', 'true');
    const tokens = pitchTokens(container);
    const rbCoord = FORMATIONS['4-3-3'][1];
    const rbToken = findTokenByNum(tokens, lineup[1].num);
    expect(rbToken).toHaveStyle({ left: `${rbCoord.x}%`, top: `${rbCoord.y}%` });
  });

  it('선발 라인업 카드에 포메이션 라벨 배지가 갱신된다', async () => {
    const user = userEvent.setup();
    render(<SquadTab />);
    await user.click(screen.getByRole('button', { name: '3-4-2-1' }));
    expect(screen.getByText('3-4-2-1', { selector: 'span' })).toBeInTheDocument();
  });
});
