/**
 * Highlights page — model-layer types (ST-1).
 *
 * 이 브랜치는 **UI + 목데이터**만 구현한다(API 제외). e_entities에 highlight 도메인이
 * 없으므로(AD-5) HighlightItem을 이 슬라이스에 로컬 정의한다. 시안(highlights.jsx)의
 * 축약 키(t/cat/comp/dur)는 시안 내부 표기일 뿐이므로 명시적 필드명을 사용한다.
 *
 * UseHighlightsResult는 useHighlights(ST-2)의 반환 계약이다 — ST-6(HighlightsContent/
 * HighlightsPage)이 이 인터페이스로 훅을 소비한다.
 */

/** 데이터에 실제로 존재하는 카테고리(DESIGN-NOTES). '전체'는 필터 전용이라 제외. */
export type HighlightCategory = '골' | '어시스트' | '세이브' | '수비' | '풀매치';

/** 필터 값 — 데이터 카테고리 + '전체'(전체 표시). */
export type CategoryFilter = '전체' | HighlightCategory;

export type HighlightSortKey = 'recent' | 'views';

/** 목록 아이템 — DESIGN-NOTES 데이터 형태를 명시적 필드명으로 옮긴 것(AD-5). */
export interface HighlightItem {
  id: string;
  title: string;
  category: HighlightCategory;
  competition: string;
  /** "2025.05.18" 형식. */
  date: string;
  /** "2.4M" | "940K" 형식 — parseViewCount로 정렬 시 수치화. */
  views: string;
  /** "1:42" 형식. */
  duration: string;
  /** 대표 영상 여부 — true면 splitFeatured가 우선 선택(AD-6). */
  featured?: boolean;
  /** 대표 영상 본문 설명. */
  description?: string;
}

/** 데이터 소스 — 목/실 데이터 교체 지점(AD-2). useHighlights가 주입받는다. */
export type HighlightsSource = () => HighlightItem[];

/** useHighlights(ST-2) 반환 계약. */
export interface UseHighlightsResult {
  category: CategoryFilter;
  sortKey: HighlightSortKey;
  /** 1-base 현재 페이지. */
  page: number;
  /** 최초 로딩(스켈레톤 표시 구간). */
  isLoading: boolean;
  /** 대표 영상 — showFeatured=false면 항상 undefined(AD-6). */
  featured: HighlightItem | undefined;
  /** 현재 페이지에 표시할 항목(필터·정렬·페이지네이션 반영 후). */
  pageItems: HighlightItem[];
  /** 필터 반영 후 전체 개수(페이지네이션 제외) — 결과 개수 표시용. */
  totalCount: number;
  totalPages: number;
  changeCategory: (category: CategoryFilter) => void;
  changeSort: (sortKey: HighlightSortKey) => void;
  goToPage: (page: number) => void;
}
