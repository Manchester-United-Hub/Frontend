/**
 * /highlights 라우트 스모크 테스트 (HL-1, D-27/D-29 갱신).
 *
 * 하이라이트는 실 API가 없어(D-11 발견5) 라우트가 `HighlightsComingSoon`(준비중 화면)을
 * 렌더하도록 교체됐다 — 더 이상 `@pages/highlights`의 `HighlightsPage`(목데이터 목록 UI)를
 * 마운트하지 않는다. `b_pages/highlights/**`는 이 서브태스크에서 건드리지 않았으므로
 * 그 세부 시나리오 테스트(test/b_pages/highlights/HighlightsPage.test.tsx)는 별도로 그대로
 * 남아 통과해야 한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import Highlights from '@app/highlights/page';

afterEach(cleanup);

describe('Highlights 라우트 (app/highlights/page)', () => {
  it('런타임 에러 없이 마운트되고 준비중 화면(<main> + h1 "하이라이트" + 안내 문구)이 렌더된다', () => {
    const { container } = render(<Highlights />);

    expect(container.querySelector('main')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: '하이라이트' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '하이라이트 준비 중이에요' }),
    ).toBeInTheDocument();
  });
});
