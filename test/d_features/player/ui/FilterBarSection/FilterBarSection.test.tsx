/**
 * FilterBarSection 단위 테스트.
 *
 * 검증 목적:
 * - FilterSelect 3개(포지션/활약연도/스쿼드) 렌더 + 선택 시 각 onXChange 호출
 * - decadeOptions/squadOptions가 없으면(undefined·빈 배열) 해당 셀렉트를 렌더하지 않는다(리뷰 H-3)
 * - RosterSearchField(ADR-1): aria-label·placeholder, 타이핑 시 onQueryChange 호출,
 *   값이 있을 때만 clear(X) 버튼이 나타나고 클릭 시 onQueryChange('') 호출
 * - 새로고침 버튼 클릭 시 onRefresh 호출
 */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { FilterBarSection } from '@features/player/ui/FilterBarSection';
import type { FilterOption } from '@features/player/model/types';
import type { PlayerFilterCriteria } from '@entities/player/model/playerFilter';
import { ALL_FILTER_KEY } from '@entities/player/model/playerFilter';

beforeAll(() => {
  // Headless UI Listbox가 옵션을 스크롤·측정할 때 사용 — jsdom 미구현이라 스텁.
  Element.prototype.scrollIntoView = () => {};
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

const POSITIONS: FilterOption[] = [
  { key: ALL_FILTER_KEY, label: '전체' },
  { key: 'MF', label: '미드필더 · MF' },
];
const DECADES: FilterOption[] = [
  { key: ALL_FILTER_KEY, label: '전체 연도' },
  { key: '2020', label: '2020년대' },
];
const SQUADS: FilterOption[] = [
  { key: ALL_FILTER_KEY, label: '전체 스쿼드' },
  { key: '1군', label: '1군' },
];

const BASE_CRITERIA: PlayerFilterCriteria = {
  position: ALL_FILTER_KEY,
  decade: ALL_FILTER_KEY,
  squad: ALL_FILTER_KEY,
  query: '',
};

function renderFilterBar(overrides?: {
  criteria?: Partial<PlayerFilterCriteria>;
  onPositionChange?: (key: string) => void;
  onDecadeChange?: (key: string) => void;
  onSquadChange?: (key: string) => void;
  onQueryChange?: (query: string) => void;
  onRefresh?: () => void;
}) {
  return render(
    <FilterBarSection
      criteria={{ ...BASE_CRITERIA, ...overrides?.criteria }}
      positionOptions={POSITIONS}
      decadeOptions={DECADES}
      squadOptions={SQUADS}
      onPositionChange={overrides?.onPositionChange ?? vi.fn()}
      onDecadeChange={overrides?.onDecadeChange ?? vi.fn()}
      onSquadChange={overrides?.onSquadChange ?? vi.fn()}
      onQueryChange={overrides?.onQueryChange ?? vi.fn()}
      onRefresh={overrides?.onRefresh ?? vi.fn()}
    />,
  );
}

describe('FilterBarSection', () => {
  it('FilterSelect 3개(포지션/활약연도/스쿼드)를 렌더한다', () => {
    renderFilterBar();
    expect(screen.getByRole('button', { name: '포지션' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '활약연도' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '스쿼드' })).toBeInTheDocument();
  });

  it('decadeOptions/squadOptions를 넘기지 않으면 해당 셀렉트를 렌더하지 않는다(리뷰 H-3)', () => {
    render(
      <FilterBarSection
        criteria={BASE_CRITERIA}
        positionOptions={POSITIONS}
        onPositionChange={vi.fn()}
        onDecadeChange={vi.fn()}
        onSquadChange={vi.fn()}
        onQueryChange={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: '포지션' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '활약연도' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '스쿼드' })).not.toBeInTheDocument();
  });

  it('decadeOptions/squadOptions가 빈 배열이어도 해당 셀렉트를 렌더하지 않는다(리뷰 H-3)', () => {
    render(
      <FilterBarSection
        criteria={BASE_CRITERIA}
        positionOptions={POSITIONS}
        decadeOptions={[]}
        squadOptions={[]}
        onPositionChange={vi.fn()}
        onDecadeChange={vi.fn()}
        onSquadChange={vi.fn()}
        onQueryChange={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: '활약연도' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '스쿼드' })).not.toBeInTheDocument();
  });

  it('포지션 옵션 선택 시 onPositionChange가 key로 호출된다', async () => {
    const user = userEvent.setup();
    const onPositionChange = vi.fn();
    renderFilterBar({ onPositionChange });

    await user.click(screen.getByRole('button', { name: '포지션' }));
    await user.click(screen.getByRole('option', { name: '미드필더 · MF' }));

    expect(onPositionChange).toHaveBeenCalledWith('MF');
  });

  it('검색 입력: aria-label·placeholder를 렌더한다', () => {
    renderFilterBar();
    expect(screen.getByRole('textbox', { name: '선수 검색' })).toHaveAttribute(
      'placeholder',
      '선수 이름 (한글·영문)',
    );
  });

  it('검색 입력 값이 비어있으면 clear 버튼을 렌더하지 않는다', () => {
    renderFilterBar({ criteria: { query: '' } });
    expect(screen.queryByRole('button', { name: '검색어 지우기' })).not.toBeInTheDocument();
  });

  it('검색어를 입력하면 onQueryChange가 호출된다', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    renderFilterBar({ onQueryChange });

    await user.type(screen.getByRole('textbox', { name: '선수 검색' }), '브루누');

    expect(onQueryChange).toHaveBeenCalled();
  });

  it('검색어가 있으면 clear 버튼이 나타나고 클릭 시 onQueryChange("")가 호출된다', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    renderFilterBar({ criteria: { query: '브루누' }, onQueryChange });

    const clearButton = screen.getByRole('button', { name: '검색어 지우기' });
    await user.click(clearButton);

    expect(onQueryChange).toHaveBeenCalledWith('');
  });

  it('새로고침 버튼 클릭 시 onRefresh가 호출된다', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    renderFilterBar({ onRefresh });

    await user.click(screen.getByRole('button', { name: /새로고침/ }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
