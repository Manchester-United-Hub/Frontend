/**
 * FeaturedMatchPanelSkeleton 단위 테스트.
 *
 * 검증 목적:
 * - 자리표시자 컨테이너가 aria-hidden으로 보조기기에서 숨겨진다
 * - FeaturedMatchPanel 형태(상단 배지 / 팀 3열 / 메타 행 / 액션)에 대응하는 Skeleton 블록을 렌더한다
 * - 텍스트 콘텐츠를 노출하지 않는다
 * - className을 래퍼에 병합한다
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { FeaturedMatchPanelSkeleton } from '@pages/landing/ui/HeroSection/FeaturedMatchPanelSkeleton';

afterEach(cleanup);

/** 상단 배지(2) + 팀 3열(엠블럼2·이름2·VS1=5) + 메타 행(2) + 액션(1) 자리표시자 개수 */
const SKELETON_BLOCK_COUNT = 10;

describe('FeaturedMatchPanelSkeleton', () => {
  it('컨테이너를 aria-hidden으로 숨긴다', () => {
    const { container } = render(<FeaturedMatchPanelSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden');
  });

  it('FeaturedMatchPanel 형태에 맞는 자리표시자 블록을 렌더한다', () => {
    const { container } = render(<FeaturedMatchPanelSkeleton />);

    expect(
      container.querySelectorAll('[class*="animate-pulse"]')
    ).toHaveLength(SKELETON_BLOCK_COUNT);
  });

  it('텍스트를 노출하지 않는다', () => {
    const { container } = render(<FeaturedMatchPanelSkeleton />);

    expect(container.textContent).toBe('');
  });

  it('전달된 className을 래퍼에 병합한다', () => {
    const { container } = render(<FeaturedMatchPanelSkeleton className="custom-class" />);

    expect(container.firstElementChild).toHaveClass('custom-class');
  });
});
