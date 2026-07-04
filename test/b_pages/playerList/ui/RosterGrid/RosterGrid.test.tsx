/**
 * RosterGrid 단위 테스트.
 *
 * 검증 목적:
 * - ul[role=list] + li(선수 수만큼) 렌더
 * - PlayerCard 확장 props(number 병기, 국적 flag, href) 전달 확인
 * - 반응형 그리드 클래스(5→4→3→2열) 포함 확인
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { RosterGrid } from '@pages/playerList/ui/RosterGrid';
import { playerDetailHref } from '@pages/playerList/model/mockData';
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

describe('RosterGrid', () => {
  it('ul[role=list] + 선수 수만큼 li를 렌더한다', () => {
    const { container } = render(<RosterGrid players={players} />);
    const list = container.querySelector('ul[role="list"]');
    expect(list).not.toBeNull();
    expect(list!.querySelectorAll('li')).toHaveLength(2);
  });

  it('반응형 그리드 클래스(5→4→3→2열)를 포함한다', () => {
    const { container } = render(<RosterGrid players={players} />);
    const list = container.querySelector('ul[role="list"]');
    expect(list?.className).toContain('grid-cols-5');
    expect(list?.className).toContain('max-[1100px]:grid-cols-4');
    expect(list?.className).toContain('max-[980px]:grid-cols-3');
    expect(list?.className).toContain('max-[620px]:grid-cols-2');
  });

  it('포지션 배지에 번호를 병기한다 ("MF · 8")', () => {
    render(<RosterGrid players={players} />);
    expect(screen.getByText('MF · 8')).toBeInTheDocument();
  });

  it('국적 flag(aria-hidden)+국가명 메타 행을 렌더한다', () => {
    render(<RosterGrid players={players} />);
    expect(screen.getByText('포르투갈')).toBeInTheDocument();
    expect(screen.getByText('잉글랜드')).toBeInTheDocument();
  });

  it('은퇴 선수는 은퇴 배지를 렌더한다', () => {
    render(<RosterGrid players={players} />);
    expect(screen.getAllByText('은퇴').length).toBeGreaterThan(0);
  });

  it('카드 전체가 선수별 상세 링크(playerDetailHref)로 연결된다', () => {
    render(<RosterGrid players={players} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', playerDetailHref(players[0].id));
    expect(links[1]).toHaveAttribute('href', playerDetailHref(players[1].id));
  });

  it('players가 빈 배열이면 li 없이 빈 목록을 렌더한다', () => {
    const { container } = render(<RosterGrid players={[]} />);
    const list = container.querySelector('ul[role="list"]');
    expect(list).not.toBeNull();
    expect(list!.querySelectorAll('li')).toHaveLength(0);
  });
});
