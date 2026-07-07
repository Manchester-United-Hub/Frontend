/**
 * /highlights 라우트 스모크 테스트 — QA 커버리지 갭 메우기(club/page.test.tsx 미러).
 *
 * 라우트 엔트리(Highlights 컴포넌트)가 실제로 HighlightsPage를 마운트해 런타임 에러 없이
 * 렌더되는지만 검증한다 — 세부 시나리오(필터·정렬·페이지네이션)는
 * test/b_pages/highlights/HighlightsPage.test.tsx가 이미 담당한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import Highlights from '@app/highlights/page';

afterEach(cleanup);

describe('Highlights 라우트 (app/highlights/page)', () => {
  it('런타임 에러 없이 마운트되고 HighlightsPage(<main> + h1 "하이라이트")가 렌더된다', () => {
    const { container } = render(<Highlights />);
    expect(container.querySelector('main')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: '하이라이트' })).toBeInTheDocument();
  });
});
