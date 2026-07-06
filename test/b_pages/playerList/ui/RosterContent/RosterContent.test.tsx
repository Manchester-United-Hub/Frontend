/**
 * RosterContent 단위 테스트.
 *
 * 검증 목적 — 로딩 → 0건 → 뷰(card/list) 3단 분기가 올바른 하위 영역을 렌더:
 * - isLoading이면 스켈레톤(aria-hidden, 선수명 미표시)
 * - 결과 0건이면 RosterEmpty(빈 상태 문구)
 * - view='card'면 RosterGrid, view='list'면 RosterListView(리스트 헤더)
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
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
});
