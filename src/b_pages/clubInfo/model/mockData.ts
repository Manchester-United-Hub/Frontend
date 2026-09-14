/**
 * Manchester United Hub — club info page mock data.
 *
 * Reconciled 1:1 against the design source's `window.CLUB_DATA`
 * (`.design-ref/club-data.js` in the harness project, manu-united-club).
 * Values below (identity·summary·history·manager·stadium) are copied
 * verbatim from that file — do not hand-edit text/numbers here without
 * re-checking the source. `subTabs` mirrors the `TABS` constant in club.jsx
 * (component-local, not in club-data.js); `emptyTabCopy` is supplementary
 * (EmptyTab's real call-site data wasn't present in the captured source) —
 * see result-ST-001.md for the full reconciliation note.
 *
 * No imports from e_entities / d_features / app/api (SERVICE.md 결합도 원칙).
 */

import type {
  ClubIdentity,
  SummaryCard,
  HistoryEvent,
  Manager,
  Stadium,
  SubTabMeta,
  EmptyTabCopy,
} from './types';

// ───────── Identity ─────────

export const clubIdentity: ClubIdentity = {
  name: '맨체스터 유나이티드 FC',
  en: 'Manchester United Football Club',
  nickname: 'The Red Devils · 붉은 악마',
  founded: '1878',
  crest: 'MUN',
};

// ───────── Summary (6) ─────────

export const summaryCards: SummaryCard[] = [
  { icon: 'History', label: '창단연도', en: 'Founded', value: '1878', sub: 'Newton Heath LYR' },
  { icon: 'MapPin', label: '연고지', en: 'Location', value: '맨체스터', sub: '잉글랜드 트래포드' },
  { icon: 'Building2', label: '홈구장', en: 'Stadium', value: '올드 트래포드', sub: '74,310석' },
  { icon: 'Trophy', label: '리그', en: 'League', value: '프리미어리그', sub: '1부 · 잉글랜드' },
  { icon: 'Crown', label: '구단주', en: 'Owner', value: '래트클리프 · 글레이저', sub: '지분 공동' },
  { icon: 'User', label: '감독', en: 'COACH', value: '마이클 캐릭', sub: '2026.01 부임' },
];

// ───────── History (10) ─────────

export const historyEvents: HistoryEvent[] = [
  { year: '1878', title: '뉴턴 히스 LYR 창단', desc: '랭커셔·요크셔 철도 노동자들이 구단을 결성.', tag: '창단' },
  { year: '1902', title: '맨체스터 유나이티드로 개명', desc: '파산 위기에서 J.H. 데이비스의 투자로 구단명을 바꿈.', tag: '전환점' },
  { year: '1910', title: '올드 트래포드 개장', desc: '‘꿈의 극장’ 홈구장으로 이전.', tag: '홈구장' },
  { year: '1968', title: '첫 유러피언컵 우승', desc: '잉글랜드 클럽 최초로 유럽 정상에 등극.', tag: '유럽', trophy: true },
  { year: '1986', title: '퍼거슨 감독 부임', desc: '26년 장기 집권의 시작.', tag: '감독' },
  { year: '1999', title: '트레블 달성', desc: '프리미어리그·FA컵·챔피언스리그 동시 석권.', tag: '트레블', trophy: true },
  { year: '2008', title: '두 번째 빅이어', desc: '모스크바 결승에서 챔피언스리그 우승.', tag: '유럽', trophy: true },
  { year: '2013', title: '퍼거슨 시대 마감', desc: '20번째 리그 우승과 함께 은퇴.', tag: '전환점' },
  { year: '2024', title: 'INEOS 체제 출범', desc: '스포츠 부문 운영권 변경, 구조 개편 착수.', tag: '구단 운영' },
  { year: '현재', title: '재건의 시즌', desc: '새 감독 체제 아래 스쿼드와 시스템을 재정비 중.', tag: '현재', now: true },
];

// ───────── Manager ─────────

export const manager: Manager = {
  name: '마이클 캐릭',
  en: 'Michael Carrick',
  nat: '잉글랜드',
  flag: 'eng',
  role: '감독 · Head Coach',
  appointed: '2026년 1월',
  born: '1981년 7월 28일',
  birthplace: '잉글랜드 타인위어주 월센드',
  contract: '2028년 6월까지',
  prevClubs: [
    '맨체스터 유나이티드 (감독 대행)',
    '맨체스터 유나이티드 (코치)',
    '맨체스터 유나이티드 (플레잉 코치)',
  ],
};

// ───────── Stadium ─────────

export const stadium: Stadium = {
  name: '올드 트래포드',
  en: 'Old Trafford',
  nickname: 'Theatre of Dreams · 꿈의 극장',
  opened: '1910',
  capacity: '74,310',
  address: 'Sir Matt Busby Way, 맨체스터 M16 0RA',
  pitch: '105m × 68m',
  record: '76,962명 (1939)',
  facts: [
    { icon: 'User', label: '수용 인원', value: '74,994석' },
    { icon: 'History', label: '개장', value: '1910년' },
    { icon: 'Ruler', label: '피치 규격', value: '105 × 68 m' },
    { icon: 'TrendingUp', label: '최다 관중', value: '73,738명' },
  ],
};

// ───────── Sub tabs ─────────
// Mirrors club.jsx's TABS constant (component-local, not in club-data.js).

export const subTabs: SubTabMeta[] = [
  { id: 'history', kr: '연혁', en: 'History' },
  { id: 'manager', kr: '감독', en: 'COACH' },
  { id: 'stadium', kr: '홈구장', en: 'Stadium' },
  { id: 'stats', kr: '팀통계', en: 'Stats', soon: true },
];

/**
 * Copy for the `soon` sub tab, rendered via EmptyTab (f_shared StateBox).
 * Supplementary — not present in club-data.js (see file header note).
 */
export const emptyTabCopy: Record<'stats', EmptyTabCopy> = {
  stats: { icon: 'BarChart3', desc: '시즌 팀 통계는 준비 중입니다. 곧 만나보실 수 있어요.' },
};
