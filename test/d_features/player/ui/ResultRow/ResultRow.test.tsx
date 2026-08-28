/**
 * ResultRow 단위 테스트 (ViewToggle 어댑터 포함 — plan.json ST-3A 파일 경계상 이 파일이
 * ViewToggle 렌더/핸들러 검증까지 함께 담당한다).
 *
 * 검증 목적:
 * - "총 N명의 선수를 찾았습니다 · n/m 페이지" 카운트·페이지 위치 렌더 (N 강조)
 * - ViewToggle: aria-label='보기 전환', 현재 view가 aria-checked=true로 반영
 * - 옵션 클릭 시 onViewChange가 호출된다 (ADR-7·9: 세그먼트 트랙 마크업 신규 없음 — SegmentedControl 소비)
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { ResultRow } from '@features/player/ui/ResultRow';

afterEach(cleanup);

describe('ResultRow', () => {
  it('결과 카운트를 렌더한다', () => {
    const { container } = render(<ResultRow count={7} page={1} totalPages={1} view="card" onViewChange={() => {}} />);
    expect(container.textContent).toContain('총 7명의 선수를 찾았습니다');
  });

  it('카운트(N)를 강조 요소로 렌더한다', () => {
    render(<ResultRow count={7} page={1} totalPages={1} view="card" onViewChange={() => {}} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('현재 페이지 위치를 "n/m 페이지"로 렌더한다', () => {
    const { container } = render(
      <ResultRow count={20} page={2} totalPages={3} view="card" onViewChange={() => {}} />,
    );
    expect(container.textContent).toContain('2/3 페이지');
  });

  it('ViewToggle을 radiogroup으로 렌더하고 현재 view가 checked다', () => {
    render(<ResultRow count={3} page={1} totalPages={1} view="list" onViewChange={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: '보기 전환' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '카드뷰' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: '리스트뷰' })).toHaveAttribute('aria-checked', 'true');
  });

  it('다른 뷰 옵션 클릭 시 onViewChange가 해당 값으로 호출된다', async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    render(<ResultRow count={3} page={1} totalPages={1} view="card" onViewChange={onViewChange} />);

    await user.click(screen.getByRole('radio', { name: '리스트뷰' }));

    expect(onViewChange).toHaveBeenCalledWith('list');
  });
});
