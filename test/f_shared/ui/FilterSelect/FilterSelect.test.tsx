import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { FilterSelect } from '@shared/ui';

beforeAll(() => {
  // Headless UI가 옵션을 스크롤·측정할 때 사용 — jsdom 미구현이라 스텁.
  Element.prototype.scrollIntoView = () => {};
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

const OPTIONS = [
  { key: 'all', label: '전체 포지션' },
  { key: 'GK', label: 'GK' },
  { key: 'MF', label: 'MF' },
];

describe('FilterSelect (Listbox)', () => {
  it('label과 선택된 값을 렌더한다', () => {
    render(
      <FilterSelect label="포지션" value="all" options={OPTIONS} onChange={() => {}} />,
    );
    expect(screen.getByText('포지션')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '포지션' })).toHaveTextContent('전체 포지션');
  });

  it('aria-label 미지정 시 label로 폴백한다', () => {
    render(
      <FilterSelect label="스쿼드" value="all" options={OPTIONS} onChange={() => {}} />,
    );
    expect(screen.getByRole('button', { name: '스쿼드' })).toBeInTheDocument();
  });

  it('aria-label을 지정하면 우선한다', () => {
    render(
      <FilterSelect
        label="스쿼드"
        value="all"
        options={OPTIONS}
        onChange={() => {}}
        aria-label="스쿼드 선택"
      />,
    );
    expect(screen.getByRole('button', { name: '스쿼드 선택' })).toBeInTheDocument();
  });

  it('버튼 클릭 시 옵션 목록이 열리고 선택하면 onChange가 key로 호출된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterSelect label="포지션" value="all" options={OPTIONS} onChange={onChange} />,
    );

    await user.click(screen.getByRole('button', { name: '포지션' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'MF' }));
    expect(onChange).toHaveBeenCalledWith('MF');
  });

  it('className을 wrapper에 병합한다', () => {
    const { container } = render(
      <FilterSelect
        label="포지션"
        value="all"
        options={OPTIONS}
        onChange={() => {}}
        className="flex-1"
      />,
    );
    expect(container.querySelector('.flex-1')).not.toBeNull();
  });
});
