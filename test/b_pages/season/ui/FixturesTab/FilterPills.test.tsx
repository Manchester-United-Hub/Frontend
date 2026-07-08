/**
 * FilterPills 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: 옵션 버튼 렌더, aria-pressed(현재 value와 일치하는 버튼만 true),
 * 클릭 시 onChange가 해당 value로 호출.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { FilterPills } from '@pages/season/ui/FixturesTab/FilterPills';

afterEach(cleanup);

const OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'home', label: '홈' },
  { value: 'away', label: '원정' },
] as const;

describe('FilterPills', () => {
  it('옵션 버튼을 모두 렌더하고, 현재 value와 일치하는 버튼만 aria-pressed=true이다', () => {
    render(<FilterPills label="홈/원정" options={OPTIONS} value="home" onChange={() => {}} />);

    expect(screen.getByRole('group', { name: '홈/원정' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '홈' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '원정' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('버튼 클릭 시 onChange가 해당 옵션 value로 호출된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterPills label="홈/원정" options={OPTIONS} value="all" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '원정' }));
    expect(onChange).toHaveBeenCalledWith('away');
  });
});
