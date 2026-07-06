/**
 * RosterSkeleton 단위 테스트.
 *
 * 검증 목적:
 * - 기본값(DEFAULT_SKELETON_CARD_COUNT)개의 스켈레톤 카드 렌더
 * - count prop으로 카드 개수 지정 가능
 * - 각 카드가 사진(정사각) + 텍스트 3줄 조합
 * - 전체 컨테이너 aria-hidden
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {
  RosterSkeleton,
  DEFAULT_SKELETON_CARD_COUNT,
} from '@pages/playerList/ui/RosterSkeleton';

afterEach(cleanup);

describe('RosterSkeleton', () => {
  it('컨테이너가 aria-hidden이다', () => {
    const { container } = render(<RosterSkeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it(`기본값(DEFAULT_SKELETON_CARD_COUNT=${DEFAULT_SKELETON_CARD_COUNT})개의 스켈레톤 카드를 렌더한다`, () => {
    const { container } = render(<RosterSkeleton />);
    const cards = container.firstElementChild!.children;
    expect(cards).toHaveLength(DEFAULT_SKELETON_CARD_COUNT);
  });

  it('count prop으로 렌더할 카드 개수를 지정할 수 있다', () => {
    const { container } = render(<RosterSkeleton count={4} />);
    const cards = container.firstElementChild!.children;
    expect(cards).toHaveLength(4);
  });

  it('각 카드는 사진 스켈레톤(정사각) + 텍스트 스켈레톤 3줄로 구성된다', () => {
    const { container } = render(<RosterSkeleton />);
    const firstCard = container.firstElementChild!.firstElementChild!;
    const skeletons = firstCard.querySelectorAll('[aria-hidden]');
    // 1개(사진) + 3개(텍스트 3줄) = 4개
    expect(skeletons.length).toBe(4);
    expect(firstCard.querySelector('.aspect-square')).not.toBeNull();
  });
});
