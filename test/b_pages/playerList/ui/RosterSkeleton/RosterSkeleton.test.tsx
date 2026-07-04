/**
 * RosterSkeleton 단위 테스트.
 *
 * 검증 목적:
 * - SKELETON_CARD_COUNT(10)개의 스켈레톤 카드 렌더
 * - 각 카드가 사진(정사각) + 텍스트 3줄 조합
 * - 전체 컨테이너 aria-hidden
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { RosterSkeleton } from '@pages/playerList/ui/RosterSkeleton';
import { SKELETON_CARD_COUNT } from '@pages/playerList/model/mockData';

afterEach(cleanup);

describe('RosterSkeleton', () => {
  it('컨테이너가 aria-hidden이다', () => {
    const { container } = render(<RosterSkeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it(`스켈레톤 카드를 SKELETON_CARD_COUNT(${SKELETON_CARD_COUNT})개 렌더한다`, () => {
    const { container } = render(<RosterSkeleton />);
    const cards = container.firstElementChild!.children;
    expect(cards).toHaveLength(SKELETON_CARD_COUNT);
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
