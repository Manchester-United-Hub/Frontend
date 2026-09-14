/**
 * ClubPage 통합 테스트 — QA 검증(qa-clubInfo).
 *
 * 검증 목적:
 * - 런타임 에러 없이 마운트, 초기 탭 = history
 * - 서브탭 전환(4탭) 시 해당 tabpanel만 렌더
 * - 준비중 탭(팀통계) EmptyTab(StateBox) 렌더
 * - 탭 접근성 계약: role=tablist/tab/tabpanel, aria-selected/aria-controls/aria-labelledby 짝
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { ClubPage } from '@pages/clubInfo';

afterEach(cleanup);

describe('ClubPage 스모크', () => {
  it('런타임 에러 없이 마운트되고 <main> 존재', () => {
    const { container } = render(<ClubPage />);
    expect(container.querySelector('main')).not.toBeNull();
  });

  it('초기 탭은 history — 연혁 타임라인이 기본 렌더된다', () => {
    render(<ClubPage />);
    expect(screen.getByRole('tab', { name: /연혁/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('뉴턴 히스 LYR 창단')).toBeInTheDocument();
  });

  it('tablist/tab 개수 = 4, tabpanel 1개만 렌더', () => {
    render(<ClubPage />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });

  it('각 tab의 id/aria-controls가 대응 tabpanel의 id/aria-labelledby와 짝을 이룬다', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);

    const stadiumTab = screen.getByRole('tab', { name: /홈구장/ });
    expect(stadiumTab).toHaveAttribute('id', 'tab-stadium');
    expect(stadiumTab).toHaveAttribute('aria-controls', 'panel-stadium');

    await user.click(stadiumTab);

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-stadium');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-stadium');
    expect(stadiumTab).toHaveAttribute('aria-selected', 'true');
  });

  it('4개 탭 전부에서 id/aria-controls가 대응 tabpanel의 id/aria-labelledby와 짝을 이룬다', async () => {
    // qa-clubInfo Medium #1: manager·stadium만 값 단언이 있던 계약을 history·stats까지
    // 포함한 4탭 전부로 확장한다(순회 검증).
    const user = userEvent.setup();
    render(<ClubPage />);

    const tabIdCases: Array<{ name: RegExp; id: string }> = [
      { name: /연혁/, id: 'history' },
      { name: /^감독/, id: 'manager' },
      { name: /홈구장/, id: 'stadium' },
      { name: /팀통계/, id: 'stats' },
    ];

    for (const { name, id } of tabIdCases) {
      const tab = screen.getByRole('tab', { name });
      expect(tab).toHaveAttribute('id', `tab-${id}`);
      expect(tab).toHaveAttribute('aria-controls', `panel-${id}`);

      await user.click(tab);

      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('id', `panel-${id}`);
      expect(panel).toHaveAttribute('aria-labelledby', `tab-${id}`);
      expect(tab).toHaveAttribute('aria-selected', 'true');
    }
  });
});

describe('ClubPage 서브탭 전환', () => {
  it('감독 탭 클릭 시 ManagerTab의 신상 정보(이름·출생)가 렌더된다', async () => {
    // 주의: "마이클 캐릭"은 SummaryCards(항상 렌더, 감독 카드 value)에도 등장하므로
    // ManagerTab의 h2(mgr-id 이름, heading role)로 스코프해 중복 매치를 피한다.
    // 출생일(mgr-facts 5행 중 하나)은 SummaryCards에는 없는 값이라 조립 자체를 검증한다.
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /^감독/ }));
    expect(screen.getByRole('heading', { level: 2, name: '마이클 캐릭' })).toBeInTheDocument();
    expect(screen.getByText('1981년 7월 28일')).toBeInTheDocument();
  });

  it('감독 탭 클릭 시 경력(Career) 타임라인도 함께 렌더된다', async () => {
    // ADR-9 이전 "선수정보 탭 클릭 시 SquadTab(포메이션 컨트롤) 렌더" 시나리오의 재조준.
    // squad 탭이 삭제되어(D-1) 검증 대상을 잃었으므로, 감독 탭의 우측 컬럼(ManagerCareer)
    // 렌더를 확인해 "탭 전환 시 해당 탭 고유의 중첩 구조가 렌더된다"는 의도를 이어받는다.
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /^감독/ }));
    expect(screen.getByRole('heading', { level: 3, name: '경력 · Career' })).toBeInTheDocument();
    expect(screen.getByText('2026.01 – 현재')).toBeInTheDocument();
  });

  it('홈구장 탭 클릭 시 StadiumTab 렌더', async () => {
    // 주의: "올드 트래포드"는 SummaryCards(항상 렌더)에도 값으로 등장하므로
    // StadiumTab의 h3 제목(heading role)으로 스코프해 중복 매치를 피한다.
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /홈구장/ }));
    expect(screen.getByRole('heading', { level: 3, name: '올드 트래포드' })).toBeInTheDocument();
  });

  it('팀통계 탭 클릭 시 EmptyTab(준비중) 렌더', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /팀통계/ }));
    expect(screen.getByText('팀통계 준비 중이에요')).toBeInTheDocument();
  });

  it('팀통계 탭의 EmptyTab 설명 문구도 함께 렌더된다', async () => {
    // 이전 "하이라이트 탭 클릭 시 EmptyTab(준비중) 렌더" 시나리오의 재조준.
    // highlights 탭이 삭제되어(D-1) 남은 유일한 EmptyTab 탭(stats)의 다른 필드(description)로
    // 검증 대상을 옮겨 EmptyTab이 label 외 copy.desc도 함께 조립함을 확인한다.
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /팀통계/ }));
    expect(
      screen.getByText('시즌 팀 통계는 준비 중입니다. 곧 만나보실 수 있어요.')
    ).toBeInTheDocument();
  });

  it('연속으로 여러 탭을 전환해도 매번 정확히 1개 tabpanel만 남는다(연속 동작 일관성)', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);

    const order = [/^감독/, /홈구장/, /팀통계/, /연혁/];
    for (const name of order) {
      await user.click(screen.getByRole('tab', { name }));
      expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    }
    // 마지막으로 연혁으로 되돌아왔으므로 초기 상태로 복원되어야 한다
    expect(screen.getByRole('tab', { name: /연혁/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('뉴턴 히스 LYR 창단')).toBeInTheDocument();
  });

  it('탭을 갔다가 되돌아와도(감독→홈구장→감독) 정확히 1개의 올바른 패널만 남는다', async () => {
    // qa-clubInfo Medium #2: 기존 연속 전환 테스트는 한 방향으로만 순회한다.
    // 같은 탭으로 되돌아오는 왕복(A→B→A)에서도 패널이 정확히 1개이고 올바른 탭만
    // aria-selected=true인지 검증한다.
    const user = userEvent.setup();
    render(<ClubPage />);

    await user.click(screen.getByRole('tab', { name: /^감독/ }));
    expect(screen.getByRole('heading', { level: 2, name: '마이클 캐릭' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /홈구장/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 3, name: '올드 트래포드' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /^감독/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: '마이클 캐릭' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^감독/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /홈구장/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('이미 활성인 탭을 다시 클릭해도(멱등) 상태와 패널 개수가 그대로 유지된다', async () => {
    // qa-clubInfo Medium #2: 이미 활성인 탭 재클릭(멱등성) 시나리오.
    const user = userEvent.setup();
    render(<ClubPage />);

    const historyTab = screen.getByRole('tab', { name: /연혁/ });
    expect(historyTab).toHaveAttribute('aria-selected', 'true');

    await user.click(historyTab);

    expect(historyTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByText('뉴턴 히스 LYR 창단')).toBeInTheDocument();
  });
});
