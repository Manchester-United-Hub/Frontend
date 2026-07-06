/**
 * PlayerHeader 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * PlayerHeader 폴더 내부 서브컴포넌트(PlayerPhoto·PlayerInfoGrid·PlayerSilhouette·
 * BackLink)는 이 파일에서 함께 검증한다(클럽 페이지 선례 — ClubHeader.test.tsx가
 * 폴더 단위로 서브컴포넌트를 함께 다루는 방식과 동일).
 *
 * 검증 목적:
 * - 주장 배지(captain) 분기 — 있음/없음
 * - 현역/은퇴 태그·정보그리드 8번째 셀(현재 상태 vs 방출/은퇴) 분기
 * - 레전드 배지(legend) — PlayerPhoto
 * - 9칸 정보 그리드 렌더(dt/dd 쌍)
 * - BackLink — /players 고정 경로
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { getPlayerById } from '@pages/playerDetail/model';
import type { PlayerDetail } from '@pages/playerDetail/model';
import { BackLink, PlayerHeader } from '@pages/playerDetail/ui';

afterEach(cleanup);

describe('PlayerHeader — 주장 배지 분기', () => {
  it('주장(captain=true)이면 "주장 · C" 배지가 렌더된다 — bruno', () => {
    const bruno = getPlayerById('bruno') as PlayerDetail;
    render(<PlayerHeader player={bruno} />);
    expect(screen.getByText('주장 · C')).toBeInTheDocument();
  });

  it('주장이 아니면 배지가 렌더되지 않는다 — rashford', () => {
    const rashford = getPlayerById('rashford') as PlayerDetail;
    render(<PlayerHeader player={rashford} />);
    expect(screen.queryByText('주장 · C')).not.toBeInTheDocument();
  });
});

describe('PlayerHeader — 현역/은퇴 분기', () => {
  it('현역이면 "현역" 태그와 정보그리드 8번째 셀 "현재 상태: 현역 · 1군"이 렌더된다 — bruno', () => {
    const bruno = getPlayerById('bruno') as PlayerDetail;
    render(<PlayerHeader player={bruno} />);
    expect(screen.getByText('현역')).toBeInTheDocument();
    expect(screen.getByText('현재 상태')).toBeInTheDocument();
    expect(screen.getByText('현역 · 1군')).toBeInTheDocument();
    expect(screen.queryByText('방출 / 은퇴')).not.toBeInTheDocument();
  });

  it('은퇴(레전드)면 "은퇴" 태그와 정보그리드 8번째 셀 "방출 / 은퇴: {left}"가 렌더된다 — rooney', () => {
    const rooney = getPlayerById('rooney') as PlayerDetail;
    render(<PlayerHeader player={rooney} />);
    expect(screen.getByText('은퇴')).toBeInTheDocument();
    expect(screen.getByText('방출 / 은퇴')).toBeInTheDocument();
    expect(screen.getByText(rooney.left as string)).toBeInTheDocument();
    expect(screen.queryByText('현재 상태')).not.toBeInTheDocument();
  });

  it('Eyebrow는 현역이면 "First Team", 은퇴면 "Former Player"를 포함한다', () => {
    const bruno = getPlayerById('bruno') as PlayerDetail;
    const { unmount } = render(<PlayerHeader player={bruno} />);
    expect(screen.getByText(/First Team/)).toBeInTheDocument();
    unmount();

    const rooney = getPlayerById('rooney') as PlayerDetail;
    render(<PlayerHeader player={rooney} />);
    expect(screen.getByText(/Former Player/)).toBeInTheDocument();
  });
});

describe('PlayerHeader — 9칸 정보 그리드', () => {
  it('9개 dt/dd 쌍(국적·생년월일·출생지·신장체중·주발·포지션·입단·상태·트로피)이 모두 렌더된다', () => {
    const bruno = getPlayerById('bruno') as PlayerDetail;
    render(<PlayerHeader player={bruno} />);

    expect(screen.getByText('국적')).toBeInTheDocument();
    expect(screen.getByText(bruno.nat)).toBeInTheDocument();
    expect(screen.getByText('생년월일')).toBeInTheDocument();
    expect(screen.getByText(`${bruno.dob} (${bruno.age}세)`)).toBeInTheDocument();
    expect(screen.getByText('출생지')).toBeInTheDocument();
    expect(screen.getByText(bruno.birth)).toBeInTheDocument();
    expect(screen.getByText('신장 / 체중')).toBeInTheDocument();
    expect(screen.getByText(`${bruno.height}cm · ${bruno.weight}kg`)).toBeInTheDocument();
    expect(screen.getByText('주발')).toBeInTheDocument();
    expect(screen.getByText(bruno.foot)).toBeInTheDocument();
    expect(screen.getByText('입단')).toBeInTheDocument();
    expect(screen.getByText(bruno.joined)).toBeInTheDocument();
    expect(screen.getByText('우승 트로피')).toBeInTheDocument();
    expect(screen.getByText(`${bruno.trophies}회`)).toBeInTheDocument();
  });

  it('GK는 포지션 라벨이 "골키퍼"로 렌더된다 — onana', () => {
    const onana = getPlayerById('onana') as PlayerDetail;
    render(<PlayerHeader player={onana} />);
    expect(screen.getAllByText(/골키퍼/).length).toBeGreaterThan(0);
  });
});

describe('BackLink', () => {
  it('/players로 이동하는 링크를 렌더한다', () => {
    render(<BackLink />);
    const link = screen.getByRole('link', { name: /선수 목록/ });
    expect(link).toHaveAttribute('href', '/players');
  });
});

/**
 * mockData.ts의 실제 은퇴 선수는 전원 legend=true(레전드)라서 "은퇴했지만
 * 레전드가 아닌" 조합과 "은퇴했지만 left(방출일) 기록이 없는" 조합은 실제
 * 데이터로는 도달 불가능한 분기다(PlayerPhoto의 `!legend && retired` 은퇴
 * 배지, PlayerInfoGrid의 `left ?? '-'` 폴백). 타입상 가능한 조합이므로
 * 합성 fixture로 분기 커버리지를 보강한다.
 */
const RETIRED_NON_LEGEND_NO_LEFT: PlayerDetail = {
  id: 'qa-fixture-retired-non-legend',
  num: 99,
  nm: '테스트 은퇴 선수',
  en: 'Test Retired Player',
  pos: 'DF',
  nat: '테스트국',
  flag: 'xx',
  years: '2010–2015',
  dob: '1990.01.01',
  age: 36,
  birth: '테스트시, 테스트국',
  height: 180,
  weight: 75,
  foot: '오른발',
  joined: '2010.01.01',
  left: null,
  career: { apps: 100, goals: 5, assists: 3 },
  trophies: 0,
  status: 'retired',
  squad: '1군',
  radar: [
    { k: '슈팅', v: 50 },
    { k: '패스', v: 50 },
    { k: '드리블', v: 50 },
    { k: '스피드', v: 50 },
    { k: '수비', v: 50 },
    { k: '피지컬', v: 50 },
  ],
  ovr: 50,
};

describe('PlayerHeader — 은퇴·비레전드·left=null 경계 조합(합성 fixture, 분기 커버리지)', () => {
  it('PlayerPhoto: legend가 아니면서 은퇴면 "은퇴" 배지(레전드 배지 아님)가 렌더된다', () => {
    render(<PlayerHeader player={RETIRED_NON_LEGEND_NO_LEFT} />);
    expect(screen.getAllByText('은퇴').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('레전드')).not.toBeInTheDocument();
  });

  it('PlayerInfoGrid: left가 null이면 "방출 / 은퇴" 셀 값이 "-"로 폴백된다', () => {
    render(<PlayerHeader player={RETIRED_NON_LEGEND_NO_LEFT} />);
    expect(screen.getByText('방출 / 은퇴')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
