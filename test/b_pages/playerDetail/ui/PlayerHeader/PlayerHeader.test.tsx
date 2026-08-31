/**
 * PlayerHeader 단위 테스트 — 실 API 데이터 기반 재작성(PD-3).
 *
 * PlayerHeader 폴더 내부 서브컴포넌트(PlayerPhoto·PlayerInfoGrid·PlayerSilhouette·
 * BackLink)는 이 파일에서 함께 검증한다(클럽 페이지 선례 — ClubHeader.test.tsx가
 * 폴더 단위로 서브컴포넌트를 함께 다루는 방식과 동일).
 *
 * 이전 버전은 `getPlayerById(slug)`로 mock 선수(주장·활동연도·현역/은퇴·영문명
 * 필드 포함)를 조회했으나, PD-3의 model/types.ts 재작성으로 그 필드·함수
 * 자체가 사라져 이 파일도 새 `PlayerDetail` 형태의 로컬 fixture로 전량
 * 교체했다(getPlayerById 제거는 model/index.ts가 아니라 model/types.ts +
 * PlayerDetailPage.tsx 재작성의 직접적 귀결 — PD-3 files 목록 밖이었던 이
 * 테스트가 깨진 이유).
 *
 * 남은 검증 목적:
 * - 제거된 배지·서브타이틀(주장·활동연도·현역/은퇴·영문명)이 여전히 렌더되지
 *   않는지(D-23, 필드 자체가 없으므로 당연하지만 회귀 가드로 유지)
 * - Eyebrow가 정적 "First Team" 텍스트로 대체됐는지(PD-3 판정, PD-2 인계 #2)
 * - 4칸 정보 그리드 렌더(dt/dd 쌍) + 신장/체중 값에 cm/kg 접미사가 있는지
 *   (PD-2 인계 #3 — D-23 가정이 틀렸음을 확인해 접미사를 되살림)
 * - num/pos/height/weight가 전부 없는 선수도 '-'로 방어되는지(D-31)
 * - BackLink — /players 고정 경로
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

import { BackLink, PlayerHeader } from '@pages/playerDetail/ui';
import type { PlayerDetail } from '@pages/playerDetail/model';
import { FIXTURE_NULL_BIO } from '@test/b_pages/playerDetail/model/playerFixtures';

afterEach(cleanup);

const BRUNO: PlayerDetail = {
  id: 1485,
  num: 8,
  nm: 'Bruno Fernandes',
  pos: 'MF',
  nat: 'Portugal',
  dob: '1994-09-08',
  age: 31,
  height: '179',
  weight: '66',
  photo: 'https://media.api-sports.io/football/players/1485.png',
};

const ONANA: PlayerDetail = {
  id: 24309,
  num: 24,
  nm: 'André Onana',
  pos: 'GK',
  nat: 'Cameroon',
  dob: '1996-04-02',
  age: 30,
  height: '190',
  weight: '92',
  photo: 'https://media.api-sports.io/football/players/24309.png',
};

/** num/pos/height/weight가 전부 없는 선수 — D-31·PD-1이 보고한 결측 케이스. */
const UNKNOWN_FIELDS: PlayerDetail = {
  id: 284324,
  num: null,
  nm: 'A. Garnacho',
  pos: undefined,
  nat: 'Argentina',
  dob: '2004-07-01',
  age: 21,
  height: null,
  weight: null,
  photo: 'https://media.api-sports.io/football/players/284324.png',
};

describe('PlayerHeader — 제거된 배지·서브타이틀이 렌더되지 않는다 (D-23, 필드 자체가 없음)', () => {
  it('주장 배지·활동연도 배지·현역/은퇴 배지·영문명 서브타이틀이 렌더되지 않는다', () => {
    render(<PlayerHeader player={BRUNO} />);
    expect(screen.queryByText('주장 · C')).not.toBeInTheDocument();
    expect(screen.queryByText('현역')).not.toBeInTheDocument();
    expect(screen.queryByText('은퇴')).not.toBeInTheDocument();
    expect(screen.queryByText('레전드')).not.toBeInTheDocument();
  });

  it('Eyebrow는 정적 "First Team" 텍스트로 대체된다(PD-3 판정 — squad/status 필드 제거)', () => {
    render(<PlayerHeader player={BRUNO} />);
    expect(screen.getByText('First Team')).toBeInTheDocument();
  });
});

describe('PlayerHeader — 4칸 정보 그리드 (D-23)', () => {
  it('4개 dt/dd 쌍(국적·생년월일·신장체중·포지션)만 렌더된다', () => {
    render(<PlayerHeader player={BRUNO} />);

    expect(screen.getByText('국적')).toBeInTheDocument();
    expect(screen.getByText('Portugal')).toBeInTheDocument();
    expect(screen.getByText('생년월일')).toBeInTheDocument();
    expect(screen.getByText('1994-09-08 (31세)')).toBeInTheDocument();
    expect(screen.getByText('신장 / 체중')).toBeInTheDocument();
    expect(screen.getByText('179cm · 66kg')).toBeInTheDocument();

    expect(screen.queryByText('출생지')).not.toBeInTheDocument();
    expect(screen.queryByText('주발')).not.toBeInTheDocument();
    expect(screen.queryByText('입단')).not.toBeInTheDocument();
    expect(screen.queryByText('방출 / 은퇴')).not.toBeInTheDocument();
    expect(screen.queryByText('현재 상태')).not.toBeInTheDocument();
    expect(screen.queryByText('우승 트로피')).not.toBeInTheDocument();
  });

  it('신장/체중 값에 cm/kg 접미사가 붙는다 — PD-2 인계 #3(D-23 가정 오류 정정, D-13 실측)', () => {
    render(<PlayerHeader player={BRUNO} />);
    expect(screen.queryByText('179 · 66')).not.toBeInTheDocument();
    expect(screen.getByText('179cm · 66kg')).toBeInTheDocument();
  });

  it('GK는 포지션 라벨이 "골키퍼"로 렌더된다', () => {
    render(<PlayerHeader player={ONANA} />);
    expect(screen.getAllByText(/골키퍼/).length).toBeGreaterThan(0);
  });
});

describe('PlayerHeader — num/pos/height/weight 결측 방어 (D-31, PD-1)', () => {
  it('num이 null이면 "-"로 렌더된다(등번호·PlayerPhoto 배지·워터마크)', () => {
    render(<PlayerHeader player={UNKNOWN_FIELDS} />);
    expect(screen.getByText('#-')).toBeInTheDocument();
  });

  it('pos가 undefined면 포지션 배지·정보그리드 셀이 "-"로 렌더된다', () => {
    render(<PlayerHeader player={UNKNOWN_FIELDS} />);
    expect(screen.getByText('포지션')).toBeInTheDocument();
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('height/weight가 null이면 신장/체중 셀이 "- · -"로 렌더된다', () => {
    // PlayerPhoto 배지("pos · num" 조합)도 결측 시 동일한 "- · -" 텍스트를
    // 렌더하므로 getAllByText로 스코프한다(단일 요소 단정 시 다중 매치 에러).
    render(<PlayerHeader player={UNKNOWN_FIELDS} />);
    expect(screen.getAllByText('- · -').length).toBeGreaterThan(0);
  });
});

describe('PlayerHeader — 국적·생년월일 null 경계 (ST-002 인계, PlayerInfoGrid nullable 흡수)', () => {
  it('국적·생년월일이 null이면 각각 "-"로 렌더된다 (nat/dob/age nullable 전파, height/weight/pos는 채워둠)', () => {
    render(<PlayerHeader player={FIXTURE_NULL_BIO} />);
    expect(screen.getByText('국적')).toBeInTheDocument();
    expect(screen.getByText('생년월일')).toBeInTheDocument();
    // nat 셀·dob 셀이 각각 정확히 '-'를 렌더한다. height/weight/pos는 채워둬 다른 결측
    // 경로(UNKNOWN_FIELDS가 이미 커버)와 매치가 섞이지 않는다.
    expect(screen.getAllByText('-')).toHaveLength(2);
  });
});

describe('PlayerPhoto — 실 API 사진 연동 (code-review M-4)', () => {
  it('player.photo로 사진을 렌더한다(alt=선수 이름)', () => {
    render(<PlayerHeader player={BRUNO} />);
    expect(screen.getByAltText('Bruno Fernandes')).toBeInTheDocument();
  });

  it('이미지 로드에 실패하면 실루엣+숫자 워터마크로 폴백한다(Crest.tsx 선례와 동일 패턴)', () => {
    render(<PlayerHeader player={BRUNO} />);
    fireEvent.error(screen.getByAltText('Bruno Fernandes'));

    expect(screen.queryByAltText('Bruno Fernandes')).not.toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });
});

describe('BackLink', () => {
  it('/players로 이동하는 링크를 렌더한다', () => {
    render(<BackLink />);
    const link = screen.getByRole('link', { name: /선수 목록/ });
    expect(link).toHaveAttribute('href', '/players');
  });
});
