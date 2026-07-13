/**
 * 하이라이트 목데이터 (ST-1, UI 목 전용).
 *
 * DESIGN-NOTES.md의 14개(h1~h14)를 그대로 옮긴다 — 값 변경 금지.
 * getHighlights는 실 데이터 훅으로 교체될 지점(AD-2)이므로 HighlightsSource 계약을 따른다.
 */

import type { CategoryFilter, HighlightItem, HighlightsSource } from './types';

/** 페이지당 카드 수(DESIGN-NOTES §카드 그리드). */
export const PAGE_SIZE = 9;

/** 최초 로딩 시뮬레이션 지연(ms) — 테스트는 delayMs를 낮춰 결정적으로 만든다. */
export const HIGHLIGHTS_FETCH_DELAY_MS = 400;

/** 필터 바 카테고리 pill 목록. '전체'는 필터 전용(데이터엔 없음). */
export const HIGHLIGHT_CATEGORIES: readonly CategoryFilter[] = [
  '전체',
  '골',
  '어시스트',
  '세이브',
  '수비',
  '풀매치',
] as const;

/** 맨유 허브 하이라이트 목데이터(14개, DESIGN-NOTES 순서 그대로). */
export const MOCK_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'h1',
    title: '회일룬 리버풀전 극장골',
    category: '골',
    competition: '프리미어리그',
    date: '2025.05.18',
    views: '2.4M',
    duration: '1:42',
    featured: true,
    description: '올드 트래포드를 뒤흔든 후반 추가시간 결승골. 가르나초의 크로스를 회일룬이 헤더로 마무리했다.',
  },
  {
    id: 'h2',
    title: '브루누 중거리 프리킥',
    category: '골',
    competition: 'FA컵',
    date: '2025.05.11',
    views: '1.8M',
    duration: '0:58',
  },
  {
    id: 'h3',
    title: '오나나 연속 선방',
    category: '세이브',
    competition: '챔피언스리그',
    date: '2025.05.06',
    views: '940K',
    duration: '2:15',
  },
  {
    id: 'h4',
    title: '가르나초 솔로 드리블 골',
    category: '골',
    competition: '프리미어리그',
    date: '2025.04.27',
    views: '3.1M',
    duration: '1:05',
  },
  {
    id: 'h5',
    title: '메이누 베스트 어시스트',
    category: '어시스트',
    competition: '프리미어리그',
    date: '2025.04.20',
    views: '720K',
    duration: '1:48',
  },
  {
    id: 'h6',
    title: '맨체스터 더비 풀 하이라이트',
    category: '풀매치',
    competition: '프리미어리그',
    date: '2025.04.13',
    views: '5.2M',
    duration: '9:30',
  },
  {
    id: 'h7',
    title: '래시포드 시즌 골 모음',
    category: '골',
    competition: '전 대회',
    date: '2025.04.02',
    views: '1.3M',
    duration: '4:11',
  },
  {
    id: 'h8',
    title: '달롯 태클 모음',
    category: '수비',
    competition: '프리미어리그',
    date: '2025.03.22',
    views: '410K',
    duration: '1:33',
  },
  {
    id: 'h9',
    title: '카세미루 박스투박스',
    category: '어시스트',
    competition: '챔피언스리그',
    date: '2025.03.15',
    views: '680K',
    duration: '2:40',
  },
  {
    id: 'h10',
    title: '마르티네스 골라인 클리어런스',
    category: '수비',
    competition: '프리미어리그',
    date: '2025.03.08',
    views: '560K',
    duration: '0:46',
  },
  {
    id: 'h11',
    title: '에버턴전 멀티골',
    category: '풀매치',
    competition: '프리미어리그',
    date: '2025.03.01',
    views: '1.1M',
    duration: '8:22',
  },
  {
    id: 'h12',
    title: '오나나 페널티 선방',
    category: '세이브',
    competition: 'FA컵',
    date: '2025.02.22',
    views: '1.7M',
    duration: '1:12',
  },
  {
    id: 'h13',
    title: '가르나초 시저스킥',
    category: '골',
    competition: '프리미어리그',
    date: '2025.02.14',
    views: '4.6M',
    duration: '0:52',
  },
  {
    id: 'h14',
    title: '브루누 어시스트 마스터클래스',
    category: '어시스트',
    competition: '전 대회',
    date: '2025.02.05',
    views: '890K',
    duration: '3:18',
  },
];

/** 기본 데이터 소스 — useHighlights의 source 기본값(AD-2). */
export const getHighlights: HighlightsSource = () => MOCK_HIGHLIGHTS;
