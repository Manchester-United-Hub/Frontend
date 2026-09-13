/**
 * Manchester United Hub — landing page mock data.
 *
 * Based on design reference data.js.
 * No imports from e_entities / d_features / app/api (ADR-4).
 *
 * Route hrefs omitted for all items — target pages do not yet exist (ADR-7).
 */

import type { HeroContent, MatchItem } from './types';

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
