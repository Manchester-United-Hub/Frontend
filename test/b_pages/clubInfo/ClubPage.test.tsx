/**
 * ClubPage 통합 테스트 — QA 검증(qa-clubInfo).
 *
 * 검증 목적:
 * - 런타임 에러 없이 마운트, 초기 탭 = history
 * - 서브탭 전환(6탭) 시 해당 tabpanel만 렌더
 * - 준비중 탭(하이라이트·팀통계) EmptyTab(StateBox) 렌더
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

  it('tablist/tab 개수 = 6, tabpanel 1개만 렌더', () => {
    render(<ClubPage />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(6);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });

  it('각 tab의 id/aria-controls가 대응 tabpanel의 id/aria-labelledby와 짝을 이룬다', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);

    const squadTab = screen.getByRole('tab', { name: /선수정보/ });
    expect(squadTab).toHaveAttribute('id', 'tab-squad');
    expect(squadTab).toHaveAttribute('aria-controls', 'panel-squad');

    await user.click(squadTab);

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-squad');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-squad');
    expect(squadTab).toHaveAttribute('aria-selected', 'true');
  });
});

describe('ClubPage 서브탭 전환', () => {
  it('선수정보 탭 클릭 시 SquadTab(포메이션 컨트롤) 렌더', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /선수정보/ }));
    // ADR-9: FormationSegmentedControl이 공통 SegmentedControl(RadioGroup)로 리팩터되어
    // role이 group → radiogroup으로 바뀐다(체크포인트 A 승인 사항의 기계적 후속 조정).
    expect(screen.getByRole('radiogroup', { name: '포메이션 선택' })).toBeInTheDocument();
    expect(screen.getByText('선발 라인업')).toBeInTheDocument();
  });

  it('감독 탭 클릭 시 ManagerTab(승률) 렌더', async () => {
    // 주의: "뤼번 아모림"은 SummaryCards(항상 렌더, 감독 카드 value)에도 등장하므로
    // ManagerTab의 h3(감독 카드 이름, heading role)으로 스코프해 중복 매치를 피한다.
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /^감독/ }));
    expect(screen.getByRole('heading', { level: 3, name: '뤼번 아모림' })).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('홈구장 탭 클릭 시 StadiumTab 렌더', async () => {
    // 주의: "올드 트래포드"는 SummaryCards(항상 렌더)에도 값으로 등장하므로
    // StadiumTab의 h3 제목(heading role)으로 스코프해 중복 매치를 피한다.
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /홈구장/ }));
    expect(screen.getByRole('heading', { level: 3, name: '올드 트래포드' })).toBeInTheDocument();
  });

  it('하이라이트 탭 클릭 시 EmptyTab(준비중) 렌더', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /하이라이트/ }));
    expect(screen.getByText('하이라이트 준비 중이에요')).toBeInTheDocument();
  });

  it('팀통계 탭 클릭 시 EmptyTab(준비중) 렌더', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);
    await user.click(screen.getByRole('tab', { name: /팀통계/ }));
    expect(screen.getByText('팀통계 준비 중이에요')).toBeInTheDocument();
  });

  it('연속으로 여러 탭을 전환해도 매번 정확히 1개 tabpanel만 남는다(연속 동작 일관성)', async () => {
    const user = userEvent.setup();
    render(<ClubPage />);

    const order = [/선수정보/, /홈구장/, /하이라이트/, /^감독/, /연혁/];
    for (const name of order) {
      await user.click(screen.getByRole('tab', { name }));
      expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    }
    // 마지막으로 연혁으로 되돌아왔으므로 초기 상태로 복원되어야 한다
    expect(screen.getByRole('tab', { name: /연혁/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('뉴턴 히스 LYR 창단')).toBeInTheDocument();
  });
});
