/**
 * PlayerCardSkeleton 단위 테스트.
 *
 * 검증 목적:
 * - 자리표시자 컨테이너가 aria-hidden으로 보조기기에서 숨겨진다
 * - PlayerCard 형태에 대응하는 Skeleton 블록을 렌더한다
 * - 텍스트 콘텐츠를 노출하지 않는다
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { PlayerCardSkeleton } from '@pages/landing/ui/SquadPreviewSection/PlayerCardSkeleton';

afterEach(cleanup);

/** 이미지 자리표시자(1) + 하단 텍스트 자리표시자(3) 개수 */
const SKELETON_BLOCK_COUNT = 4;

describe('PlayerCardSkeleton', () => {
  it('컨테이너를 aria-hidden으로 숨긴다', () => {
    const { container } = render(<PlayerCardSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden');
  });

  it('PlayerCard 형태에 맞는 자리표시자 블록을 렌더한다', () => {
    const { container } = render(<PlayerCardSkeleton />);

    expect(
      container.querySelectorAll('[class*="animate-pulse"]')
    ).toHaveLength(SKELETON_BLOCK_COUNT);
  });

  it('텍스트를 노출하지 않는다', () => {
    const { container } = render(<PlayerCardSkeleton />);

    expect(container.textContent).toBe('');
  });
});
