import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';

import { useHighlights } from '@pages/highlights/model';
import type { HighlightItem } from '@pages/highlights/model';

const DELAY_MS = 100;

/** 결정적 테스트용 목데이터 — id1만 featured, 카테고리·조회수·날짜를 의도적으로 분산한다. */
const makeItems = (): HighlightItem[] => [
  {
    id: '1',
    title: '골 A',
    category: '골',
    competition: 'PL',
    date: '2025.05.10',
    views: '2.4M',
    duration: '1:00',
    featured: true,
  },
  {
    id: '2',
    title: '골 B',
    category: '골',
    competition: 'PL',
    date: '2025.05.01',
    views: '1.0M',
    duration: '1:00',
  },
  {
    id: '3',
    title: '어시스트 A',
    category: '어시스트',
    competition: 'PL',
    date: '2025.04.01',
    views: '3.0M',
    duration: '1:00',
  },
  {
    id: '4',
    title: '세이브 A',
    category: '세이브',
    competition: 'PL',
    date: '2025.03.01',
    views: '500K',
    duration: '1:00',
  },
  {
    id: '5',
    title: '골 C',
    category: '골',
    competition: 'PL',
    date: '2025.02.01',
    views: '900K',
    duration: '1:00',
  },
];

describe('useHighlights', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('최초 로딩 후 isLoading이 해제되고 대표 영상을 그리드에서 제외한다', () => {
    const { result } = renderHook(() =>
      useHighlights({ source: makeItems, pageSize: 2, delayMs: DELAY_MS }),
    );

    expect(result.current.isLoading).toBe(true);
    act(() => vi.advanceTimersByTime(DELAY_MS));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.featured?.id).toBe('1');
    expect(result.current.totalCount).toBe(4);
    expect(result.current.pageItems).toHaveLength(2);
    expect(result.current.pageItems.some((item) => item.id === '1')).toBe(false);
  });

  it('카테고리 변경 시 페이지를 1로 리셋하고 그리드를 필터링한다', () => {
    const { result } = renderHook(() =>
      useHighlights({ source: makeItems, pageSize: 2, delayMs: DELAY_MS }),
    );
    act(() => vi.advanceTimersByTime(DELAY_MS));

    act(() => result.current.goToPage(2));
    expect(result.current.page).toBe(2);

    act(() => result.current.changeCategory('어시스트'));

    expect(result.current.page).toBe(1);
    expect(result.current.category).toBe('어시스트');
    expect(result.current.totalCount).toBe(1);
    expect(result.current.pageItems).toHaveLength(1);
    expect(result.current.pageItems[0].id).toBe('3');
  });

  it('정렬 변경 시 페이지를 1로 리셋하고 조회순으로 정렬한다', () => {
    const { result } = renderHook(() =>
      useHighlights({ source: makeItems, pageSize: 2, delayMs: DELAY_MS }),
    );
    act(() => vi.advanceTimersByTime(DELAY_MS));
    act(() => result.current.goToPage(2));

    act(() => result.current.changeSort('views'));

    expect(result.current.page).toBe(1);
    expect(result.current.sortKey).toBe('views');
    // featured(id1) 제외 후 조회순: 3(3.0M) > 2(1.0M) > 5(900K) > 4(500K)
    expect(result.current.pageItems.map((item) => item.id)).toEqual(['3', '2']);
  });

  it('goToPage로 다음 페이지 항목을 노출한다', () => {
    const { result } = renderHook(() =>
      useHighlights({ source: makeItems, pageSize: 2, delayMs: DELAY_MS }),
    );
    act(() => vi.advanceTimersByTime(DELAY_MS));

    // 기본 정렬(recent) 제외 featured(id1): 2, 3, 4, 5 순
    act(() => result.current.goToPage(2));

    expect(result.current.page).toBe(2);
    expect(result.current.pageItems.map((item) => item.id)).toEqual(['4', '5']);
  });

  it('showFeatured=false면 대표 영상도 그리드에 포함하고 featured는 undefined다', () => {
    const { result } = renderHook(() =>
      useHighlights({ source: makeItems, pageSize: 10, delayMs: DELAY_MS, showFeatured: false }),
    );
    act(() => vi.advanceTimersByTime(DELAY_MS));

    expect(result.current.featured).toBeUndefined();
    expect(result.current.totalCount).toBe(5);
    expect(result.current.pageItems.some((item) => item.id === '1')).toBe(true);
  });

  it('결과가 없는 카테고리는 pageItems가 0이다', () => {
    const { result } = renderHook(() =>
      useHighlights({ source: makeItems, pageSize: 2, delayMs: DELAY_MS }),
    );
    act(() => vi.advanceTimersByTime(DELAY_MS));

    act(() => result.current.changeCategory('풀매치'));

    expect(result.current.totalCount).toBe(0);
    expect(result.current.pageItems).toHaveLength(0);
    expect(result.current.totalPages).toBe(0);
  });

  it('언마운트 시 대기 중인 로딩 타이머를 정리한다', () => {
    const clearSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useHighlights({ source: makeItems, delayMs: DELAY_MS }));

    unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
