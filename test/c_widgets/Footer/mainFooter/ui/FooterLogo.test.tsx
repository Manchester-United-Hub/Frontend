import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { FooterLogo } from '@widgets/Footer/mainFooter/ui/FooterLogo';

afterEach(cleanup);

describe('FooterLogo', () => {
  it('워드마크 텍스트를 렌더한다', () => {
    const { container } = render(<FooterLogo />);
    expect(container.textContent).toContain('MANCHESTER UNITED');
    expect(container.textContent).toContain('FC HUB');
  });

  it('방패 img의 src에 자산 경로가 포함되고 svg 요소는 렌더하지 않는다', () => {
    const { container } = render(<FooterLogo />);
    expect(container.querySelector('img')?.getAttribute('src')).toContain(
      '/brand/mu-hub-stage-shield.svg',
    );
    expect(container.querySelector('svg')).toBeNull();
  });
});
