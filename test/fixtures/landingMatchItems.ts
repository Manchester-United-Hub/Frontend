import type { MatchItem } from '@pages/landing/model/types';

/**
 * b_pages/landing/model/mockData.ts에서 제거된 recentMatch·nextMatch를 그대로 옮긴 픽스처.
 * competition만 '프리미어리그'로 맞춘다(D-6 — 라운드 번호는 외부 DTO에 없어 생략).
 * 값을 리터럴로 고정해, LANDING_MATCH_COMPETITION 등 src 상수가 바뀌어도 이 픽스처를
 * 소비하는 테스트가 조용히 따라 바뀌어 통과하지 않게 한다.
 */

export const recentMatchItem: MatchItem = {
  variant: 'past',
  tag: '최근 경기',
  competition: '프리미어리그',
  home: { code: 'MUN', name: '맨체스터 유나이티드', highlight: true, score: 2 },
  away: { code: 'EVE', name: '에버턴', score: 1 },
  result: 'W',
  venue: '올드 트래포드',
  date: '5월 11일 (일)',
};

export const nextMatchItem: MatchItem = {
  variant: 'next',
  tag: '다음 경기',
  competition: '프리미어리그',
  home: { code: 'MUN', name: '맨체스터 유나이티드', highlight: true },
  away: { code: 'LIV', name: '리버풀' },
  venue: '올드 트래포드',
  date: '5월 18일 (일)',
  time: '23:30',
  countdown: 'D-3',
};
