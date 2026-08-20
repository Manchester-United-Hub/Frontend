/**
 * SummaryCards 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 검증 목적:
 * - 8개 카드가 label·en·value·sub 그대로 렌더되는가
 * - ICON_MAP에 없는 icon name을 주입했을 때 FALLBACK_ICON으로 대체되어
 *   크래시 없이 렌더되는가(SummaryCards.tsx:53 미도달 분기)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SummaryCards } from '@pages/clubInfo/ui/SummaryCards';
import { summaryCards } from '@pages/clubInfo/model/mockData';
import type { SummaryCard } from '@pages/clubInfo/model/types';

afterEach(cleanup);

describe('SummaryCards', () => {
  it('8개 카드를 렌더하고 각 카드는 label·en·value·sub를 표시한다', () => {
    render(<SummaryCards summaryCards={summaryCards} />);

    const list = screen.getByRole('list', { name: '구단 요약 정보' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(8);

    summaryCards.forEach((card) => {
      // label·en은 BilingualLabel(f_shared/ui)이 kr/en을 별도 <span>으로 렌더한다
      // (시각상 한 줄로 병기되지만 DOM 텍스트 노드는 분리) — 각각 존재를 검증한다.
      expect(screen.getAllByText(card.label).length).toBeGreaterThan(0);
      expect(screen.getAllByText(card.en).length).toBeGreaterThan(0);
      expect(screen.getByText(card.value)).toBeInTheDocument();
      expect(screen.getByText(card.sub)).toBeInTheDocument();
    });
  });

  it('ICON_MAP에 없는 icon name이면 폴백 아이콘으로 대체되어 크래시 없이 렌더된다', () => {
    const cardsWithUnknownIcon: SummaryCard[] = [
      { icon: 'NotARealIcon', label: '테스트', en: 'Test', value: '값', sub: '보조텍스트' },
    ];
    expect(() => render(<SummaryCards summaryCards={cardsWithUnknownIcon} />)).not.toThrow();
    expect(screen.getByText('테스트')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('값')).toBeInTheDocument();
  });
});
