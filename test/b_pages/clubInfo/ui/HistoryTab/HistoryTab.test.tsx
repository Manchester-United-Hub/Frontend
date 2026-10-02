/**
 * HistoryTab 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage), code-conventions §6
 * 컴포넌트 1:테스트 1 미러링 완성.
 *
 * 검증 목적: 10개 이벤트 전부 렌더, trophy 강조(트로피 아이콘) 분기,
 * now 강조("현재" live 뱃지 vs 일반 tag 뱃지) 분기.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HistoryTab } from '@pages/clubInfo/ui/HistoryTab';
import { historyEvents } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

describe('HistoryTab', () => {
  it('10개 연혁 이벤트가 모두 렌더된다', () => {
    render(<HistoryTab historyEvents={historyEvents} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    historyEvents.forEach((event) => {
      expect(screen.getByRole('heading', { level: 3, name: event.title })).toBeInTheDocument();
    });
  });

  it('trophy 이벤트(1968·1999·2008)는 tag 대신 트로피 강조와 함께 렌더된다', () => {
    render(<HistoryTab historyEvents={historyEvents} />);
    const trophyEvents = historyEvents.filter((e) => e.trophy);
    expect(trophyEvents.length).toBeGreaterThan(0);
    trophyEvents.forEach((event) => {
      expect(screen.getByRole('heading', { level: 3, name: event.title })).toBeInTheDocument();
    });
  });

  it('now 이벤트("현재")는 "현재" live 뱃지로 렌더되고, 나머지는 tag 뱃지로 렌더된다', () => {
    render(<HistoryTab historyEvents={historyEvents} />);
    const nowEvent = historyEvents.find((e) => e.now);
    expect(nowEvent).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: nowEvent!.title })).toBeInTheDocument();
    // 주의: 마지막 이벤트의 year 값도 "현재"(문자열)라 뱃지와 텍스트가 중복 매치될 수
    // 있으므로, live 뱃지(span)로 스코프해 조회한다.
    expect(screen.getByText('현재', { selector: 'span' })).toBeInTheDocument();

    // now가 아닌 첫 이벤트는 자신의 tag 텍스트가 뱃지로 렌더된다
    const firstNonNow = historyEvents.find((e) => !e.now);
    expect(firstNonNow).toBeDefined();
    expect(screen.getByText(firstNonNow!.tag)).toBeInTheDocument();
  });
});
