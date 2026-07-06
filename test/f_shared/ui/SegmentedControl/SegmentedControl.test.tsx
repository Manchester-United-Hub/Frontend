import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { SegmentedControl } from '@shared/ui';

afterEach(cleanup);

type ViewOption = 'card' | 'list';

const OPTIONS = [
  { value: 'card' as ViewOption, label: '카드뷰' },
  { value: 'list' as ViewOption, label: '리스트뷰' },
];

describe('SegmentedControl (RadioGroup)', () => {
  it('옵션을 role=radio로 렌더하고 value와 일치하는 옵션만 aria-checked=true', () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        value="card"
        onChange={() => {}}
        aria-label="보기 전환"
      />,
    );
    expect(screen.getByRole('radio', { name: '카드뷰' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '리스트뷰' })).toHaveAttribute('aria-checked', 'false');
  });

  it('radiogroup에 aria-label을 부여한다', () => {
    render(
      <SegmentedControl
        options={OPTIONS}
        value="card"
        onChange={() => {}}
        aria-label="보기 전환"
      />,
    );
    expect(screen.getByRole('radiogroup', { name: '보기 전환' })).toBeInTheDocument();
  });

  it('옵션 클릭 시 onChange가 해당 value로 호출된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        value="card"
        onChange={onChange}
        aria-label="보기 전환"
      />,
    );
    await user.click(screen.getByRole('radio', { name: '리스트뷰' }));
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('리스트뷰에서 카드뷰 옵션 클릭 시 onChange가 card로 호출된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        value="list"
        onChange={onChange}
        aria-label="보기 전환"
      />,
    );
    await user.click(screen.getByRole('radio', { name: '카드뷰' }));
    expect(onChange).toHaveBeenCalledWith('card');
  });

  it('키보드 화살표로 카드뷰 → 리스트뷰 이동이 가능하다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        value="card"
        onChange={onChange}
        aria-label="보기 전환"
      />,
    );
    screen.getByRole('radio', { name: '카드뷰' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('키보드 화살표로 리스트뷰 → 카드뷰 이동이 가능하다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        value="list"
        onChange={onChange}
        aria-label="보기 전환"
      />,
    );
    screen.getByRole('radio', { name: '리스트뷰' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith('card');
  });

  it('각 옵션(카드뷰·리스트뷰)의 icon 슬롯을 함께 렌더한다', () => {
    render(
      <SegmentedControl
        options={[
          { value: 'card' as ViewOption, label: '카드뷰', icon: <span data-testid="grid-icon" /> },
          { value: 'list' as ViewOption, label: '리스트뷰', icon: <span data-testid="list-icon" /> },
        ]}
        value="card"
        onChange={() => {}}
        aria-label="보기 전환"
      />,
    );
    expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
    expect(screen.getByTestId('list-icon')).toBeInTheDocument();
  });
});
