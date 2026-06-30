/**
 * UnitedShield 단위 테스트.
 *
 * 검증 목적:
 * - svg 렌더 + 장식 요소 aria-hidden 고정
 * - size prop이 width·height에 반영 (기본 34)
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

import { UnitedShield } from '@shared/ui';

describe('UnitedShield', () => {
  it('svg를 aria-hidden 장식 요소로 렌더', () => {
    const { container } = render(<UnitedShield />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('size 미지정 시 기본 34px', () => {
    const { container } = render(<UnitedShield />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('34');
    expect(svg?.getAttribute('height')).toBe('34');
  });

  it('size prop이 width·height에 반영', () => {
    const { container } = render(<UnitedShield size={48} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
    expect(svg?.getAttribute('height')).toBe('48');
  });
});
