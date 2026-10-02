/**
 * RosterGrid 단위 테스트.
 *
 * 검증 목적:
 * - ul[role=list] + li(선수 수만큼) 렌더
 * - PlayerCard 확장 props(number 병기, 국적 flag, href) 전달 확인
 * - 반응형 그리드 클래스(2→3→4→5열, min-width 모바일 퍼스트) 포함 확인(D-11, decision-1.md)
 * - photo 유무에 따른 실사진/실루엣 폴백 전환(D-9, ST-006b)
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { RosterGrid } from '@entities/player/ui/RosterGrid';
import { playerDetailHref } from '@entities/player/model/playerDetailHref';
import type { PlayerListItem } from '@entities/player/model/playerListItem';

afterEach(cleanup);

const PLAYER_PHOTO_URL = 'https://pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev/players/8.png';

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
    photo: PLAYER_PHOTO_URL,
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

  it('반응형 그리드 클래스(2→3→4→5열, min-width)를 포함한다(D-11)', () => {
    const { container } = render(<RosterGrid players={players} />);
    const list = container.querySelector('ul[role="list"]');
    expect(list?.className).toContain('grid-cols-2');
    expect(list?.className).toContain('min-[620px]:grid-cols-3');
    expect(list?.className).toContain('min-[980px]:grid-cols-4');
    expect(list?.className).toContain('min-[1100px]:grid-cols-5');
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

  it('photo가 있으면 실사진(img)을 렌더하고, 없으면 실루엣(svg)으로 폴백한다', () => {
    const { container } = render(<RosterGrid players={players} />);
    const items = container.querySelectorAll('li');

    expect(items[0].querySelector('img')).not.toBeNull();
    expect(items[0].querySelector('svg')).toBeNull();

    expect(items[1].querySelector('img')).toBeNull();
    expect(items[1].querySelector('svg')).not.toBeNull();
  });

  it('photo가 빈 문자열이면 slot을 넘기지 않아 실루엣(svg)으로 폴백한다', () => {
    const { container } = render(
      <RosterGrid players={[{ ...players[0], photo: '' }]} />,
    );
    const item = container.querySelector('li');

    expect(item?.querySelector('img')).toBeNull();
    expect(item?.querySelector('svg')).not.toBeNull();
  });
});
