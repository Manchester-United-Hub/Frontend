/**
 * SummaryCards 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적:
 * - 4개 카드가 label·en·value·sub 그대로 렌더되는가
 * - ICON_MAP에 없는 icon name을 주입했을 때 FALLBACK_ICON으로 대체되어
 *   크래시 없이 렌더되는가
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SummaryCards } from '@pages/season/ui/SummaryCards';
import { seasonSummaryCards } from '@pages/season/model';
import type { SeasonSummaryCard } from '@pages/season/model';

afterEach(cleanup);

describe('SummaryCards', () => {
  it('4개 카드를 렌더하고 각 카드는 label·en·value·sub를 표시한다', () => {
    render(<SummaryCards summaryCards={seasonSummaryCards} />);

    const list = screen.getByRole('list', { name: '시즌 요약 정보' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);

    seasonSummaryCards.forEach((card) => {
      expect(screen.getAllByText(card.label).length).toBeGreaterThan(0);
      expect(screen.getAllByText(card.en).length).toBeGreaterThan(0);
      expect(screen.getByText(card.value)).toBeInTheDocument();
      expect(screen.getByText(card.sub)).toBeInTheDocument();
    });
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
