/**
 * selectHighlights 단위 테스트 (ST-1)
 *
 * 검증 목적:
 * - parseViewCount가 M/K 단위를 정확히 수치화한다
 * - sortHighlights가 recent(date desc)/views(파싱값 desc)를 각각 정확히 정렬하고 원본을 불변 유지한다
 * - filterByCategory가 '전체'는 전부, 특정 카테고리는 일치 항목만 반환한다
 * - splitFeatured가 featured:true 항목을 우선 대표로, 없으면 첫 항목을 대표로 뽑고 그리드에서 제외한다
 */

import { describe, it, expect } from 'vitest';

import {
  parseViewCount,
  sortHighlights,
  filterByCategory,
  splitFeatured,
} from '@pages/highlights/model/selectHighlights';
import type { HighlightItem } from '@pages/highlights/model/types';

const buildItem = (overrides: Partial<HighlightItem> = {}): HighlightItem => ({
  id: 'h0',
  title: '테스트 영상',
  category: '골',
  competition: '프리미어리그',
  date: '2025.01.01',
  views: '1.0M',
  duration: '1:00',
  ...overrides,
});

describe('parseViewCount', () => {
  it('M 단위를 백만 단위 수치로 변환한다', () => {
    expect(parseViewCount('2.4M')).toBe(2_400_000);
  });

  it('K 단위를 천 단위 수치로 변환한다', () => {
    expect(parseViewCount('940K')).toBe(940_000);
  });
});

describe('sortHighlights', () => {
  const items = [
    buildItem({ id: 'a', date: '2025.03.01', views: '1.0M' }),
    buildItem({ id: 'b', date: '2025.05.01', views: '500K' }),
    buildItem({ id: 'c', date: '2025.01.01', views: '3.0M' }),
  ];

  it('recent — date 내림차순으로 정렬한다', () => {
    const result = sortHighlights(items, 'recent');

    expect(result.map((item) => item.id)).toEqual(['b', 'a', 'c']);
  });

  it('views — 조회수 파싱값 내림차순으로 정렬한다', () => {
    const result = sortHighlights(items, 'views');

    expect(result.map((item) => item.id)).toEqual(['c', 'a', 'b']);
  });

  it('원본 배열을 변경하지 않는다(toSorted 불변)', () => {
    const original = [...items];
    sortHighlights(items, 'recent');

    expect(items).toEqual(original);
  });
});

describe('filterByCategory', () => {
  const items = [
    buildItem({ id: 'a', category: '골' }),
    buildItem({ id: 'b', category: '세이브' }),
    buildItem({ id: 'c', category: '골' }),
  ];

  it("'전체'면 전체 항목을 반환한다", () => {
    expect(filterByCategory(items, '전체')).toEqual(items);
  });

  it('특정 카테고리는 일치하는 항목만 반환한다', () => {
    const result = filterByCategory(items, '세이브');

    expect(result.map((item) => item.id)).toEqual(['b']);
  });
});

describe('splitFeatured', () => {
  it('featured:true 항목이 있으면 그것을 대표로 뽑고 rest에서 제외한다', () => {
    const items = [
      buildItem({ id: 'a' }),
      buildItem({ id: 'b', featured: true }),
      buildItem({ id: 'c' }),
    ];

    const { featured, rest } = splitFeatured(items);

    expect(featured?.id).toBe('b');
    expect(rest.map((item) => item.id)).toEqual(['a', 'c']);
  });

  it('featured 항목이 없으면 첫 항목을 대표로 뽑는다', () => {
    const items = [buildItem({ id: 'a' }), buildItem({ id: 'b' })];

    const { featured, rest } = splitFeatured(items);

    expect(featured?.id).toBe('a');
    expect(rest.map((item) => item.id)).toEqual(['b']);
  });

  it('빈 배열이면 featured undefined, rest 빈 배열을 반환한다', () => {
    const { featured, rest } = splitFeatured([]);

    expect(featured).toBeUndefined();
    expect(rest).toEqual([]);
  });
});
