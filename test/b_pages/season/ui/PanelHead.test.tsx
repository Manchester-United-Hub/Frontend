/**
 * PanelHead 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: eyebrow·title 렌더, description 있음/없음 두 분기, headingId prop 전달.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { PanelHead } from '@pages/season/ui/PanelHead';

afterEach(cleanup);

describe('PanelHead', () => {
  it('eyebrow와 title(h2)을 렌더한다', () => {
    render(<PanelHead eyebrow="Fixtures & Results" title="일정 & 결과" />);
    expect(screen.getByText('Fixtures & Results')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '일정 & 결과' })).toBeInTheDocument();
  });

  it('description이 있으면 문단으로 렌더된다', () => {
    render(<PanelHead eyebrow="League Table" title="순위표" description="설명 문단입니다." />);
    expect(screen.getByText('설명 문단입니다.')).toBeInTheDocument();
  });

  it('description이 없으면 문단이 렌더되지 않는다', () => {
    const { container } = render(<PanelHead eyebrow="League Table" title="순위표" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('headingId를 전달하면 h2의 id로 그대로 반영된다', () => {
    render(<PanelHead eyebrow="League Table" title="순위표" headingId="table-heading" />);
    expect(screen.getByRole('heading', { level: 2, name: '순위표' })).toHaveAttribute(
      'id',
      'table-heading'
    );
  });
});
