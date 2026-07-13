/**
 * PlayerDetailSkeleton 스모크 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 검증 목적: 런타임 에러 없이 마운트되고, 로딩 상태가 스크린리더에서 숨겨진다
 * (aria-hidden main), 헤더·카드·표 형태의 스켈레톤 블록이 존재한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { PlayerDetailSkeleton } from '@pages/playerDetail';

afterEach(cleanup);

describe('PlayerDetailSkeleton', () => {
  it('런타임 에러 없이 마운트되고 <main aria-hidden="true">를 렌더한다', () => {
    const { container } = render(<PlayerDetailSkeleton />);
    const main = container.querySelector('main');
    expect(main).not.toBeNull();
    expect(main).toHaveAttribute('aria-hidden', 'true');
  });

  it('스켈레톤 블록(aria-hidden 요소)이 다수 렌더된다', () => {
    const { container } = render(<PlayerDetailSkeleton />);
    const skeletonNodes = container.querySelectorAll('[aria-hidden]');
    expect(skeletonNodes.length).toBeGreaterThan(5);
  });
});
