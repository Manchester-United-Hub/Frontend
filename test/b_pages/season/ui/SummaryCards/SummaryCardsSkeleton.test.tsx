/**
 * SummaryCardsSkeleton 컴포넌트 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적:
 * - role="status" + aria-live="polite" + aria-label로 로딩 상태를 알린다
 * - live region 안에 실제로 읽을 텍스트(sr-only)가 존재한다
 * - 시각적 자리표시자는 aria-hidden 래퍼로 감싸져 접근성 트리에서 제외된다
 * - 자리표시자 카드를 실제 SummaryCards와 같은 개수(4)만큼 렌더한다(S2-5 —
 *   개수가 어긋나면 데이터 도착 시 레이아웃이 튄다)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SummaryCards, SummaryCardsSkeleton } from '@pages/season/ui/SummaryCards';

afterEach(cleanup);

const SKELETON_ARIA_LABEL = '시즌 요약 정보를 불러오는 중';
const EXPECTED_CARD_COUNT = 4;

describe('SummaryCardsSkeleton', () => {
  it('role=status·aria-live=polite·aria-label로 로딩 중임을 알린다', () => {
    render(<SummaryCardsSkeleton />);

    const status = screen.getByRole('status', { name: SKELETON_ARIA_LABEL });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('live region 안에 실제로 읽을 알림 텍스트(sr-only)가 존재한다', () => {
    render(<SummaryCardsSkeleton />);

    expect(screen.getByText(SKELETON_ARIA_LABEL)).toBeInTheDocument();
  });

  it('시각적 자리표시자는 aria-hidden 래퍼로 감싸져 접근성 트리에서 제외된다', () => {
    const { container } = render(<SummaryCardsSkeleton />);

    const hiddenWrapper = container.querySelector('[aria-hidden]');
    expect(hiddenWrapper).toBeInTheDocument();
  });

  it('실제 SummaryCards와 동일한 개수(4)의 자리표시자 카드를 렌더한다', () => {
    render(<SummaryCardsSkeleton />);

    expect(screen.getAllByRole('listitem', { hidden: true })).toHaveLength(
      EXPECTED_CARD_COUNT
    );
  });

  describe('콘텐츠 짝 등가성 (decision-5 §1-(3) — 대조군, 이미 통과해야 정상)', () => {
    it('SummaryCards와 같은 Shell className·ul className을 렌더한다', () => {
      const { container: skeletonContainer } = render(<SummaryCardsSkeleton />);
      const skeletonShell = skeletonContainer.querySelector('.max-w-shell');
      if (!skeletonShell) throw new Error('skeleton Shell not found');
      const skeletonShellClassName = skeletonShell.className;
      const skeletonUlClassName = skeletonShell.querySelector('ul')?.className;

      cleanup();

      const { container: contentContainer } = render(
        <SummaryCards summaryCards={[]} />
      );
      const contentShell = contentContainer.querySelector('.max-w-shell');
      if (!contentShell) throw new Error('content Shell not found');

      expect(contentShell.className).toBe(skeletonShellClassName);
      expect(contentShell.querySelector('ul')?.className).toBe(
        skeletonUlClassName
      );
    });
  });
});
