/**
 * PanelHead 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage), code-conventions §6
 * 컴포넌트 1:테스트 1 미러링 완성.
 *
 * 검증 목적: eyebrow·title 렌더, description 있음/없음 두 분기, headingId prop 전달.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { PanelHead } from '@pages/clubInfo/ui/PanelHead';

afterEach(cleanup);

describe('PanelHead', () => {
  it('eyebrow와 title(h2)을 렌더한다', () => {
    render(<PanelHead eyebrow="Club History" title="연혁" />);
    expect(screen.getByText('Club History')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '연혁' })).toBeInTheDocument();
  });

  it('description이 있으면 문단으로 렌더된다', () => {
    render(<PanelHead eyebrow="Club History" title="연혁" description="설명 문단입니다." />);
    expect(screen.getByText('설명 문단입니다.')).toBeInTheDocument();
  });

  it('description이 없으면 문단이 렌더되지 않는다', () => {
    const { container } = render(<PanelHead eyebrow="Head Coach" title="감독" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('headingId를 전달하면 h2의 id로 그대로 반영된다', () => {
    render(<PanelHead eyebrow="Home Ground" title="홈구장" headingId="stadium-heading" />);
    expect(screen.getByRole('heading', { level: 2, name: '홈구장' })).toHaveAttribute(
      'id',
      'stadium-heading',
    );
  });
});
