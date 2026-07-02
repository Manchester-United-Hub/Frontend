/**
 * /club 라우트 스모크 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 이전에는 src/app/club/page.tsx가 전용 테스트 없이 0% 커버였다. 이 테스트는
 * 라우트 엔트리(Club 컴포넌트)가 실제로 ClubPage를 마운트해 런타임 에러 없이
 * 렌더되는지만 검증한다 — 세부 시나리오(탭 전환 등)는
 * test/b_pages/clubInfo/ClubPage.test.tsx가 이미 담당한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import Club from '@app/club/page';

afterEach(cleanup);

describe('Club 라우트 (app/club/page)', () => {
  it('런타임 에러 없이 마운트되고 ClubPage(<main> + 탭 6개)가 렌더된다', () => {
    const { container } = render(<Club />);
    expect(container.querySelector('main')).not.toBeNull();
    expect(screen.getAllByRole('tab')).toHaveLength(6);
  });

  it('초기 탭은 history — 연혁 타임라인이 기본 렌더된다', () => {
    render(<Club />);
    expect(screen.getByRole('tab', { name: /연혁/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('뉴턴 히스 LYR 창단')).toBeInTheDocument();
  });
});
