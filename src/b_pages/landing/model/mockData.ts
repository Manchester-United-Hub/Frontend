/**
 * Manchester United Hub — landing page mock data.
 *
 * Based on design reference data.js.
 * No imports from e_entities / d_features / app/api (ADR-4).
 *
 * Route hrefs omitted for all items — target pages do not yet exist (ADR-7).
 */

import type { HeroContent, MatchItem, CategoryItem, PlayerItem } from './types';

// ───────── Nav ─────────

// ───────── Hero ─────────

export const heroContent: HeroContent = {
  eyebrow: '2025/26 프리미어리그',
  headline: '올드 트래포드의 모든 순간을 한곳에서',
  accent: '모든 순간',
  sub: '경기 일정과 결과, 역대 선수 기록, 구단 통계까지 — 팬이 만든 맨체스터 유나이티드 허브에서 빠르게 확인하세요.',
  ctas: [
    { label: '선수 둘러보기', variant: 'red' },
    { label: '시즌 일정', variant: 'outline' },
  ],
  stats: [
    { num: '20', unit: '', label: '리그 우승' },
    { num: '3', unit: '', label: 'UCL 우승' },
    { num: '1878', unit: '', label: '창단' },
  ],
};

// ───────── Matches ─────────

export const recentMatch: MatchItem = {
  variant: 'past',
  tag: '최근 경기',
  competition: '프리미어리그 · 31R',
  home: { code: 'MUN', name: '맨체스터 유나이티드', highlight: true, score: 2 },
  away: { code: 'EVE', name: '에버턴', score: 1 },
  result: 'W',
  venue: '올드 트래포드',
  date: '5월 11일 (일)',
};

export const nextMatch: MatchItem = {
  variant: 'next',
  tag: '다음 경기',
  competition: '프리미어리그 · 32R',
  home: { code: 'MUN', name: '맨체스터 유나이티드', highlight: true },
  away: { code: 'LIV', name: '리버풀' },
  venue: '올드 트래포드',
  date: '5월 18일 (일)',
  time: '23:30 KST',
  countdown: 'D-3',
};

// ───────── Categories ─────────
// href omitted for all — target routes do not yet exist (ADR-7).
// icon key is a string identifier; the section component maps it to a lucide ReactNode.

export const categories: CategoryItem[] = [
  {
    key: 'season',
    name: '시즌',
    nameEn: 'Season',
    description: '일정·결과·순위표를 한눈에 추적',
  },
  {
    key: 'players',
    name: '선수',
    nameEn: 'Players',
    description: '현역·역대 선수 기록과 프로필',
  },
  {
    key: 'club',
    name: '구단',
    nameEn: 'Club',
    description: '연혁·홈구장·팀 통계와 감독',
  },
  {
    key: 'highlights',
    name: '하이라이트',
    nameEn: 'Highlights',
    description: '경기 영상과 베스트 순간 모음',
  },
  {
    key: 'articles',
    name: '기사',
    nameEn: 'Articles',
    description: '팬이 정리한 소식과 분석 글',
  },
];

// ───────── Squad ─────────

export const squadPlayers: PlayerItem[] = [
  {
    number: 8,
    name: '브루누 페르난데스',
    nameEn: 'Bruno Fernandes',
    position: 'MF',
    status: 'active',
    years: '2020–현재',
    nationality: '포르투갈',
  },
  {
    number: 11,
    name: '라스무스 회일룬',
    nameEn: 'Rasmus Højlund',
    position: 'FW',
    status: 'active',
    years: '2023–현재',
    nationality: '덴마크',
  },
  {
    number: 37,
    name: '코비 메이누',
    nameEn: 'Kobbie Mainoo',
    position: 'MF',
    status: 'active',
    years: '2023–현재',
    nationality: '잉글랜드',
  },
  {
    number: 10,
    name: '웨인 루니',
    nameEn: 'Wayne Rooney',
    position: 'FW',
    status: 'retired',
    years: '2004–2017',
    nationality: '잉글랜드',
  },
];
