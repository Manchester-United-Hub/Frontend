/**
 * MatchesSkeleton 컴포넌트 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적:
 * - role="status" + aria-label로 로딩 상태를 알린다
 * - live region에 실제로 읽을 텍스트(sr-only)가 존재한다
 * - SKELETON_ROW_COUNT개의 자리표시자 행을 렌더한다
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {
  MatchesSkeleton,
  SKELETON_ROW_COUNT,
} from '@pages/season/ui/MatchesTab/MatchesSkeleton';

afterEach(cleanup);

describe('MatchesSkeleton', () => {
  it('role=status와 aria-label로 로딩 중임을 알린다', () => {
    render(<MatchesSkeleton />);

    expect(
      screen.getByRole('status', { name: '경기 일정을 불러오는 중' })
    ).toBeInTheDocument();
  });

  it('live region 안에 실제로 읽을 알림 텍스트가 존재한다', () => {
    render(<MatchesSkeleton />);

    expect(screen.getByText('경기 일정을 불러오는 중')).toBeInTheDocument();
  });

  it('SKELETON_ROW_COUNT개의 자리표시자 행을 렌더한다', () => {
    render(<MatchesSkeleton />);

    expect(screen.getAllByTestId('matches-skeleton-row')).toHaveLength(
      SKELETON_ROW_COUNT
    );
  });
});
