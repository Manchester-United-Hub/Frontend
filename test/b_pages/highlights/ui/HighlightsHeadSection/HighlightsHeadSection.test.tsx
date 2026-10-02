import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HighlightsHeadSection } from '@pages/highlights/ui/HighlightsHeadSection';

afterEach(cleanup);

describe('HighlightsHeadSection', () => {
  it('h1 "하이라이트"를 렌더한다', () => {
    render(<HighlightsHeadSection />);
    expect(screen.getByRole('heading', { level: 1, name: '하이라이트' })).toBeInTheDocument();
  });

  it('eyebrow 텍스트 "Video Highlights"를 렌더한다', () => {
    render(<HighlightsHeadSection />);
    expect(screen.getByText('Video Highlights')).toBeInTheDocument();
  });

  it('설명 문구를 렌더한다', () => {
    render(<HighlightsHeadSection />);
    expect(
      screen.getByText('골과 선방, 풀매치까지 — 레드 데빌스의 가장 빛난 순간을 다시 보세요.')
    ).toBeInTheDocument();
  });
});
