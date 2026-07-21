/**
 * MonthGroup 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: 월 라벨 렌더, 그룹에 속한 경기 수만큼 listitem 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { MonthGroup } from '@pages/season/ui/MatchesTab/MonthGroup';
import { matches, MatchMonthGroup } from '@pages/season/model';

afterEach(cleanup);

describe('MonthGroup', () => {
  it('월 라벨과 해당 월의 경기 행을 모두 렌더한다', () => {
    const group: MatchMonthGroup = {
      month: '2025년 3월',
      matches: matches.slice(0, 4),
    };
    render(<MonthGroup group={group} />);

    expect(screen.getByText('2025년 3월')).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: '2025년 3월 경기 일정' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});
