/**
 * HighlightsComingSoon 전용 테스트 (HL-1, D-27/D-29).
 *
 * 검증 목적:
 * - 페이지 랜드마크 h1 "하이라이트" + StateBox 기반 준비중 안내(h2 제목·설명)가 렌더되는가
 * - `b_pages/highlights`가 아니라 app 라우트 로컬 컴포넌트가 자기 완결적으로 그려지는가
 *   (별도 mock 없이도 크래시 없이 렌더되는지로 간접 확인)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HighlightsComingSoon } from '@app/highlights/_components/HighlightsComingSoon';

afterEach(cleanup);

describe('HighlightsComingSoon', () => {
  it('h1 "하이라이트"와 준비중 안내(h2 제목 + 설명)를 렌더한다', () => {
    render(<HighlightsComingSoon />);

    expect(screen.getByRole('heading', { level: 1, name: '하이라이트' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '하이라이트 준비 중이에요' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('더 나은 하이라이트를 준비하고 있어요. 곧 만나볼 수 있어요.'),
    ).toBeInTheDocument();
  });

  it('<main> 랜드마크 안에서 렌더된다', () => {
    const { container } = render(<HighlightsComingSoon />);
    expect(container.querySelector('main')).not.toBeNull();
  });
});
