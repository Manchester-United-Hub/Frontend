import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { useState } from 'react';

import { SearchInput } from '@shared/ui';

beforeAll(() => {
  // Headless UI가 활성 옵션을 스크롤·측정할 때 사용 — jsdom 미구현이라 스텁.
  Element.prototype.scrollIntoView = () => {};
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

interface Player {
  id: number;
  name: string;
}

const PLAYERS: Player[] = [
  { id: 1, name: '브루누 페르난데스' },
  { id: 2, name: '카세미루' },
];

function Harness({ onSelect }: { onSelect?: (p: Player | null) => void }) {
  const [value, setValue] = useState<Player | null>(null);
  const [query, setQuery] = useState('');
  const items =
    query === ''
      ? PLAYERS
      : PLAYERS.filter((p) => p.name.includes(query));

  return (
    <SearchInput<Player>
      items={items}
      value={value}
      onChange={(v) => {
        setValue(v);
        onSelect?.(v);
      }}
      onQueryChange={setQuery}
      getKey={(p) => p.id}
      getLabel={(p) => p.name}
      placeholder="선수 검색"
      shortcut="/"
    />
  );
}

describe('SearchInput (Combobox)', () => {
  it('기본 aria-label "검색" combobox 입력과 shortcut kbd를 렌더한다', () => {
    render(<Harness />);
    expect(screen.getByRole('combobox', { name: '검색' })).toHaveAttribute(
      'placeholder',
      '선수 검색'
    );
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('입력하면 onQueryChange로 후보가 필터링된다', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole('combobox'), '카세');
    expect(await screen.findByText('카세미루')).toBeInTheDocument();
    expect(screen.queryByText('브루누 페르난데스')).toBeNull();
  });

  it('후보를 선택하면 onChange가 해당 항목으로 호출된다', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('브루누 페르난데스'));
    expect(onSelect).toHaveBeenCalledWith({ id: 1, name: '브루누 페르난데스' });
  });

  it('후보가 없으면 emptyMessage를 보여준다', async () => {
    const user = userEvent.setup();
    render(
      <SearchInput<Player>
        items={[]}
        value={null}
        onChange={() => {}}
        onQueryChange={() => {}}
        getKey={(p) => p.id}
        getLabel={(p) => p.name}
        emptyMessage="결과 없음"
      />
    );
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByText('결과 없음')).toBeInTheDocument();
  });

  it('renderOption으로 후보를 커스텀 렌더한다', async () => {
    const user = userEvent.setup();
    render(
      <SearchInput<Player>
        items={PLAYERS}
        value={null}
        onChange={() => {}}
        onQueryChange={() => {}}
        getKey={(p) => p.id}
        getLabel={(p) => p.name}
        renderOption={(p) => <span>★ {p.name}</span>}
      />
    );
    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByText('★ 브루누 페르난데스')).toBeInTheDocument();
  });
});
