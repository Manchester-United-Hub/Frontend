/**
 * RosterContent 단위 테스트.
 *
 * 검증 목적 — 로딩 → 에러 → 0건 → 뷰(card/list) 4단 분기가 올바른 하위 영역을 렌더:
 * - isLoading이면 스켈레톤(aria-hidden, 선수명 미표시)
 * - isError면 RosterErrorState(에러 문구), isLoading보다 우선순위 낮고 0건 분기보다 우선
 * - onRetry 전달 시 RosterErrorState에 그대로 패스스루되어 "다시 시도" 클릭이 동작
 * - 결과 0건이면 RosterEmpty(빈 상태 문구)
 * - view='card'면 RosterGrid, view='list'면 RosterListView(리스트 헤더)
 * - pagination을 주면 결과 분기에서만 페이저가 따라 렌더된다(로딩·에러·0건에는 없다)
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { RosterContent } from '@pages/playerList/ui/RosterContent';
import type { PlayerListItem } from '@pages/playerList/model/types';

afterEach(cleanup);

const players: PlayerListItem[] = [
  {
    id: 'bruno',
    number: 8,
    name: '브루누 페르난데스',
    nameEn: 'Bruno Fernandes',
    position: 'MF',
    nationality: '포르투갈',
    flagCode: 'pt',
    years: '2020–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'rooney',
    number: 10,
    name: '웨인 루니',
    nameEn: 'Wayne Rooney',
    position: 'FW',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '2004–2017',
    status: 'retired',
    squad: '레전드',
  },
];

const noop = () => {};

describe('RosterContent', () => {
  it('로딩 중이면 스켈레톤을 렌더한다(선수명 미표시)', () => {
    const { container } = render(
      <RosterContent isLoading results={players} view="card" onReset={noop} />,
    );
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText('브루누 페르난데스')).not.toBeInTheDocument();
  });

  it('결과가 0건이면 RosterEmpty를 렌더한다', () => {
    const onReset = vi.fn();
    render(<RosterContent isLoading={false} results={[]} view="card" onReset={onReset} />);
    expect(screen.getByText('조건에 맞는 선수가 없어요')).toBeInTheDocument();
  });

  it('isError면 RosterErrorState를 렌더한다(결과가 있어도 에러가 우선)', () => {
    render(
      <RosterContent isLoading={false} isError results={players} view="card" onReset={noop} />,
    );
    expect(screen.getByText('선수 목록을 불러오지 못했어요')).toBeInTheDocument();
    expect(screen.queryByText('브루누 페르난데스')).not.toBeInTheDocument();
  });

  it('onRetry 전달 시 RosterErrorState의 "다시 시도" 클릭으로 호출된다', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <RosterContent
        isLoading={false}
        isError
        results={players}
        view="card"
        onReset={noop}
        onRetry={onRetry}
      />,
    );

    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('onRetry 미지정 시 "다시 시도" 버튼을 렌더하지 않는다', () => {
    render(
      <RosterContent isLoading={false} isError results={players} view="card" onReset={noop} />,
    );
    expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument();
  });

  it('isLoading과 isError가 모두 true면 스켈레톤이 우선한다', () => {
    const { container } = render(
      <RosterContent isLoading isError results={players} view="card" onReset={noop} />,
    );
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText('선수 목록을 불러오지 못했어요')).not.toBeInTheDocument();
  });

  it("view='card'면 RosterGrid를 렌더한다(리스트 헤더 없음)", () => {
    render(<RosterContent isLoading={false} results={players} view="card" onReset={noop} />);
    expect(screen.getByText('브루누 페르난데스')).toBeInTheDocument();
    expect(screen.queryByText('활약연도')).not.toBeInTheDocument();
  });

  it("view='list'면 RosterListView를 렌더한다(리스트 헤더 표시)", () => {
    render(<RosterContent isLoading={false} results={players} view="list" onReset={noop} />);
    expect(screen.getByText('활약연도')).toBeInTheDocument();
    expect(screen.getByText('브루누 페르난데스')).toBeInTheDocument();
  });

  it('pagination을 주면 결과와 함께 페이저를 렌더한다', () => {
    render(
      <RosterContent
        isLoading={false}
        results={players}
        view="card"
        onReset={noop}
        pagination={{ page: 1, totalPages: 2, onPageChange: noop }}
      />,
    );
    expect(screen.getByRole('navigation', { name: '선수 목록 페이지' })).toBeInTheDocument();
  });

  it('pagination을 주지 않으면 페이저를 렌더하지 않는다', () => {
    render(<RosterContent isLoading={false} results={players} view="card" onReset={noop} />);
    expect(screen.queryByRole('navigation', { name: '선수 목록 페이지' })).not.toBeInTheDocument();
  });

  it.each([
    ['로딩', { isLoading: true, results: players }],
    ['에러', { isLoading: false, isError: true, results: players }],
    ['0건', { isLoading: false, results: [] as PlayerListItem[] }],
  ] as const)('%s 분기에서는 페이저를 렌더하지 않는다', (_label, props) => {
    render(
      <RosterContent
        {...props}
        view="card"
        onReset={noop}
        pagination={{ page: 1, totalPages: 2, onPageChange: noop }}
      />,
    );
    expect(screen.queryByRole('navigation', { name: '선수 목록 페이지' })).not.toBeInTheDocument();
  });

  it('페이지 클릭이 onPageChange로 전달된다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <RosterContent
        isLoading={false}
        results={players}
        view="card"
        onReset={noop}
        pagination={{ page: 1, totalPages: 2, onPageChange }}
      />,
    );

    await user.click(screen.getByRole('button', { name: '2페이지' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
