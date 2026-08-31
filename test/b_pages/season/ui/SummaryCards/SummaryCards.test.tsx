/**
 * SummaryCards 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * ST2-03에서 model/mockData.ts의 seasonSummaryCards가 삭제됐다(SummaryCards가
 * standing 실데이터 파생으로 교체됨 — D-12/CH-1). SummaryCards 컴포넌트 자체는
 * 변경되지 않았다 — 이 테스트가 바뀐 이유는 컴포넌트가 아니라 데이터 출처가
 * 바뀌었기 때문이며, 그래서 이 파일 안에 로컬 픽스처를 두고 기존 2케이스의
 * 검증 의도(4장 렌더·미지 아이콘 폴백)를 그대로 유지한다(S2-8 — 커버리지 삭제 0건).
 *
 * 검증 목적:
 * - 4개 카드가 각자의 listitem 안에서 label·en·value·sub를 렌더하는가(within
 *   스코핑 — 전역 screen.getByText는 "어느 카드에 있는가"를 검증하지 못해
 *   value/sub 전달 순서가 뒤바뀌어도 통과한다, decision-3 §2.1 H2-1)
 * - sub가 카드 간에 겹쳐도(예: 1번·4번 모두 '프리미어리그') 각 카드가 자기 위치의
 *   값을 정확히 렌더하는가 — within 스코핑이 회귀하지 않게 고정하는 케이스
 * - ICON_MAP에 없는 icon name을 주입했을 때 FALLBACK_ICON으로 대체되어
 *   크래시 없이 렌더되는가
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SummaryCards } from '@pages/season/ui/SummaryCards';
import type { SeasonSummaryCard } from '@pages/season/model';

afterEach(cleanup);

// toSeasonSummaryCards의 실제 출력 형태를 그대로 반영한다 — 프로덕션이 만들지
// 않는 값을 검증하지 않기 위해서다(decision-3 §2.1 H2-1). 1·4번째 카드의 sub가
// 둘 다 '프리미어리그'였던 중복은 M2-5로 4번째가 승률로 바뀌며 해소됐다.
const summaryCardsFixture: SeasonSummaryCard[] = [
  { icon: 'BarChart3', label: '리그 순위', en: 'Position', value: '8위', sub: '프리미어리그' },
  { icon: 'Star', label: '승점', en: 'Points', value: '47', sub: '29경기' },
  { icon: 'Target', label: '득실차', en: 'Goal Diff', value: '+7', sub: '45득점 38실점' },
  { icon: 'Trophy', label: '전적', en: 'Record', value: '14승 5무 10패', sub: '승률 48%' },
];

describe('SummaryCards', () => {
  it('4개 카드를 렌더하고 각 카드는 자신의 위치(listitem)에서 label·en·value·sub를 표시한다', () => {
    render(<SummaryCards summaryCards={summaryCardsFixture} />);

    const list = screen.getByRole('list', { name: '시즌 요약 정보' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(4);

    // screen.getByText(문서 전역)나 getAllByText(...).length > 0은 "어느 카드에
    // 있는가"를 검증하지 않는다 — SummaryCards.tsx의 value/sub 전달 순서가 뒤바뀌어도
    // 문자열 자체는 문서 어딘가에 남아 통과해버린다. within(items[i])로 카드 경계를
    // 스코핑해야 이 배선 오류를 실제로 잡는다(decision-3 §2.1 H2-1 (b)).
    summaryCardsFixture.forEach((card, index) => {
      const scope = within(items[index]);
      expect(scope.getByText(card.label)).toBeInTheDocument();
      expect(scope.getByText(card.en)).toBeInTheDocument();
      expect(scope.getByText(card.value)).toBeInTheDocument();
      expect(scope.getByText(card.sub)).toBeInTheDocument();
    });
  });

  it('보조텍스트가 겹치는 카드가 있어도 각 카드가 자기 값을 렌더한다', () => {
    // 이 케이스의 목적은 중복 자체가 아니라 위의 within 스코핑이 회귀하지 않게
    // 고정하는 것이다 — 누군가 전역 screen.getByText로 되돌리면 이 케이스가
    // getMultipleElementsFoundError로 즉시 깨진다(decision-3 §2.1 H2-1 (3)).
    const duplicatedSub: SeasonSummaryCard[] = [
      { icon: 'BarChart3', label: '리그 순위', en: 'Position', value: '8위', sub: '프리미어리그' },
      { icon: 'Trophy', label: '전적', en: 'Record', value: '14승 5무 10패', sub: '프리미어리그' },
    ];
    render(<SummaryCards summaryCards={duplicatedSub} />);

    const items = within(
      screen.getByRole('list', { name: '시즌 요약 정보' })
    ).getAllByRole('listitem');
    expect(within(items[0]).getByText('8위')).toBeInTheDocument();
    expect(within(items[0]).getByText('프리미어리그')).toBeInTheDocument();
    expect(within(items[1]).getByText('14승 5무 10패')).toBeInTheDocument();
    expect(within(items[1]).getByText('프리미어리그')).toBeInTheDocument();
  });

  it('ICON_MAP에 없는 icon name이면 폴백 아이콘으로 대체되어 크래시 없이 렌더된다', () => {
    const cardsWithUnknownIcon: SeasonSummaryCard[] = [
      { icon: 'NotARealIcon', label: '테스트', en: 'Test', value: '값', sub: '보조텍스트' },
    ];
    expect(() => render(<SummaryCards summaryCards={cardsWithUnknownIcon} />)).not.toThrow();
    expect(screen.getByText('테스트')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('값')).toBeInTheDocument();
  });
});
