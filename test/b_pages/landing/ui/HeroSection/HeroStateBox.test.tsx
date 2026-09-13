/**
 * HeroStateBox 단위 테스트 (R-4, M4 + L7).
 *
 * 검증 목적:
 * - StateBox를 다크 셸(rounded-xl·border)로 감싼다
 * - 전달된 StateBox의 title·description 내용을 그대로 렌더한다(문구는 matchStates.tsx
 *   소유 — 이 테스트는 프로덕션 문구를 재선언하지 않고 자체 StateBox 더블을 사용한다)
 * - headingLevel을 2로 오버라이드한다(기존 기본값 h4는 Hero의 유일한 h1과 두 단계 스킵)
 * - StateBox 내부(f_shared)를 수정하지 않고 className만 오버라이드해 병합한다
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StateBox } from '@shared/ui';
import { HeroStateBox } from '@pages/landing/ui/HeroSection/HeroStateBox';

afterEach(cleanup);

const testBox = (
  <StateBox variant="empty" icon={<span aria-hidden>icon</span>} title="테스트 제목" description="테스트 설명" />
);

describe('HeroStateBox', () => {
  it('다크 셸(rounded-xl·border)로 감싸 렌더한다', () => {
    const { container } = render(<HeroStateBox box={testBox} />);

    expect(container.firstElementChild).toHaveClass('rounded-xl', 'border');
  });

  it('전달된 StateBox의 title·description을 그대로 렌더한다', () => {
    render(<HeroStateBox box={testBox} />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    expect(screen.getByText('테스트 설명')).toBeInTheDocument();
  });

  it('headingLevel을 2로 오버라이드한다', () => {
    render(<HeroStateBox box={testBox} />);

    expect(screen.getByRole('heading', { level: 2, name: '테스트 제목' })).toBeInTheDocument();
  });

  it('다크 대비 className을 StateBox에 병합한다(text-white 포함)', () => {
    render(<HeroStateBox box={testBox} />);

    expect(screen.getByText('테스트 제목').closest('[class*="text-white"]')).not.toBeNull();
  });
});
