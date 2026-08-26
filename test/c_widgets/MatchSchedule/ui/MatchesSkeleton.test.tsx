/**
 * MatchesSkeleton 컴포넌트 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적:
 * - role="status" + aria-label로 로딩 상태를 알린다
 * - live region에 실제로 읽을 텍스트(sr-only)가 존재한다
 * - SKELETON_ROW_COUNT개의 자리표시자 행을 렌더한다
 * - [F-30] 콘텐츠 짝(MatchesTab) 등가성 — Shell·PanelHead·필터 행까지 포함해
 *   fallback이 콘텐츠와 같은 패널 셸을 재현하는지(decision-5 §1-(1)(2)).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {
  MatchesSkeleton,
  SKELETON_ROW_COUNT,
} from '@widgets/MatchSchedule/ui/MatchesSkeleton';
import { MatchesTab } from '@features/matches/ui';

const SEASON = '2025/26';

afterEach(cleanup);

describe('MatchesSkeleton', () => {
  it('role=status와 aria-label로 로딩 중임을 알린다', () => {
    render(<MatchesSkeleton season={SEASON} />);

    expect(
      screen.getByRole('status', { name: '경기 일정을 불러오는 중' })
    ).toBeInTheDocument();
  });

  it('live region 안에 실제로 읽을 알림 텍스트가 존재한다', () => {
    render(<MatchesSkeleton season={SEASON} />);

    expect(screen.getByText('경기 일정을 불러오는 중')).toBeInTheDocument();
  });

  it('SKELETON_ROW_COUNT개의 자리표시자 행을 렌더한다', () => {
    render(<MatchesSkeleton season={SEASON} />);

    expect(screen.getAllByTestId('matches-skeleton-row')).toHaveLength(
      SKELETON_ROW_COUNT
    );
  });

  describe('콘텐츠 짝 등가성 (decision-5 §1-(1)(2) — Shell·PanelHead·필터 행)', () => {
    it('MatchesTab과 같은 h2·설명 문구·Shell className·필터 행 className을 렌더한다', () => {
      const { container: skeletonContainer } = render(
        <MatchesSkeleton season={SEASON} />
      );
      const skeletonShell = skeletonContainer.querySelector('.max-w-shell');
      if (!skeletonShell) throw new Error('skeleton Shell not found');
      const skeletonHead = within(skeletonShell.children[0] as HTMLElement);

      const skeletonShellClassName = skeletonShell.className;
      const skeletonHeading = skeletonHead.getByRole('heading', {
        level: 2,
        hidden: true,
      }).textContent;
      const skeletonDescription =
        skeletonShell.children[0].querySelector('p')?.textContent;
      const skeletonFilterRowClassName = (
        skeletonShell.children[1] as HTMLElement
      ).className;

      cleanup();

      const { container: contentContainer } = render(
        <MatchesTab season={SEASON} matches={[]} />
      );
      const contentShell = contentContainer.querySelector('.max-w-shell');
      if (!contentShell) throw new Error('content Shell not found');
      const contentHead = within(contentShell.children[0] as HTMLElement);

      expect(contentShell.className).toBe(skeletonShellClassName);
      expect(contentHead.getByRole('heading', { level: 2 }).textContent).toBe(
        skeletonHeading
      );
      expect(contentShell.children[0].querySelector('p')?.textContent).toBe(
        skeletonDescription
      );
      expect((contentShell.children[1] as HTMLElement).className).toBe(
        skeletonFilterRowClassName
      );
    });
  });
});
