/**
 * RosterListView 단위 테스트.
 *
 * 검증 목적:
 * - 헤더 행(번호/선수/포지션/국적/활약연도/상태) 렌더
 * - 선수 수만큼 행(링크) 렌더, 각 행에 등번호·한글/영문 이름·포지션 배지·국적·연도·상태 렌더
 * - 행 전체가 선수별 상세 링크(playerDetailHref)로 연결된다
 * - 반응형: ≤980px 국적 컬럼, ≤620px 포지션 컬럼에 숨김 클래스 적용
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { RosterListView } from '@pages/playerList/ui/RosterListView';
import { playerDetailHref } from '@pages/playerList/model/playerDetailHref';
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

describe('RosterListView', () => {
  it('헤더 행(번호/선수/포지션/국적/활약연도/상태)을 렌더한다', () => {
    render(<RosterListView players={players} />);
    expect(screen.getByText('번호')).toBeInTheDocument();
    expect(screen.getByText('선수')).toBeInTheDocument();
    expect(screen.getByText('포지션')).toBeInTheDocument();
    expect(screen.getByText('국적')).toBeInTheDocument();
    expect(screen.getByText('활약연도')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
  });

  it('선수 수만큼 링크 행을 렌더한다', () => {
    render(<RosterListView players={players} />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('각 행에 등번호·한글/영문 이름·연도를 렌더한다', () => {
    render(<RosterListView players={players} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('브루누 페르난데스')).toBeInTheDocument();
    expect(screen.getByText('Bruno Fernandes')).toBeInTheDocument();
    expect(screen.getByText('2020–현재')).toBeInTheDocument();
  });

  it('상태를 점 + 텍스트("현역"/"은퇴")로 병기한다', () => {
    render(<RosterListView players={players} />);
    expect(screen.getByText('현역')).toBeInTheDocument();
    expect(screen.getByText('은퇴')).toBeInTheDocument();
  });

  it('행 전체가 선수별 상세 링크(playerDetailHref)로 렌더된다', () => {
    render(<RosterListView players={players} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(players.length);
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', playerDetailHref(players[index].id));
    });
  });

  it('국적 컬럼(헤더+행)에 ≤980px 숨김 클래스를 적용한다', () => {
    const { container } = render(<RosterListView players={players} />);
    const natHeader = screen.getByText('국적');
    expect(natHeader.className).toContain('max-[980px]:hidden');
    const natCell = container.querySelector('a span.max-\\[980px\\]\\:hidden');
    expect(natCell).not.toBeNull();
  });

  it('포지션 컬럼(헤더+행)에 ≤620px 숨김 클래스를 적용한다', () => {
    const { container } = render(<RosterListView players={players} />);
    const posHeader = screen.getByText('포지션');
    expect(posHeader.className).toContain('max-[620px]:hidden');
    const posCell = container.querySelector('a span.max-\\[620px\\]\\:hidden');
    expect(posCell).not.toBeNull();
  });
});
