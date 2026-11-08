import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { BrandShield } from '@shared/ui/BrandShield';

afterEach(cleanup);

describe('BrandShield', () => {
  it('img를 렌더하고 src에 자산 경로가 포함된다', () => {
    const { container } = render(<BrandShield />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toContain('/brand/mu-hub-stage-shield.svg');
  });

  it('intrinsic 크기 240x256을 갖는다', () => {
    const img = render(<BrandShield />).container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('240');
    expect(img?.getAttribute('height')).toBe('256');
  });

  it('장식 이미지다: alt 빈 문자열 + aria-hidden', () => {
    const img = render(<BrandShield />).container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('aria-hidden')).toBe('true');
  });

  it('기본 클래스를 유지하며 className을 병합한다', () => {
    const img = render(<BrandShield className="custom-x" />).container.querySelector('img');
    expect(img?.className).toContain('h-[34px]');
    expect(img?.className).toContain('w-auto');
    expect(img?.className).toContain('custom-x');
  });
});
