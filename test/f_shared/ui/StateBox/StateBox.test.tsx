import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StateBox } from '@shared/ui';

afterEach(cleanup);

describe('StateBox', () => {
  it('아이콘·제목(heading)·설명·액션을 렌더한다', () => {
    render(
      <StateBox
        icon={<svg data-testid="icon" />}
        title="예정된 경기가 없어요"
        description="시즌 휴식기입니다."
        action={<button>전체 일정</button>}
      />
    );
    expect(
      screen.getByRole('heading', { name: '예정된 경기가 없어요' })
    ).toBeInTheDocument();
    expect(screen.getByText('시즌 휴식기입니다.')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전체 일정' })).toBeInTheDocument();
  });

  it('variant=error는 아이콘에 destructive 톤을 적용한다', () => {
    render(
      <StateBox variant="error" icon={<svg data-testid="icon" />} title="오류" />
    );
    expect(screen.getByTestId('icon').parentElement).toHaveClass(
      'text-destructive'
    );
  });
});
