import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { LogoBlock } from '@widgets/Navbar/ui/Logo';

afterEach(cleanup);

describe('LogoBlock', () => {
  it('워드마크 텍스트를 렌더한다', () => {
    const { container } = render(<LogoBlock />);
    expect(container.textContent).toContain('MANCHESTER UNITED');
    expect(container.textContent).toContain('FC HUB');
  });

  it('방패 img의 src에 자산 경로가 포함되고 svg 요소는 렌더하지 않는다', () => {
    const { container } = render(<LogoBlock />);
    expect(container.querySelector('img')?.getAttribute('src')).toContain(
      '/brand/mu-hub-stage-shield.svg',
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  it("홈 링크 a[href='/']와 aria-label을 유지한다", () => {
    const { container } = render(<LogoBlock />);
    const link = container.querySelector("a[href='/']");
    expect(link).not.toBeNull();
    expect(link?.getAttribute('aria-label')).toBe('맨체스터 유나이티드 FC HUB 홈으로');
  });
});
