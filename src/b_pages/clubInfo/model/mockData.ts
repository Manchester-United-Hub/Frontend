/**
 * Manchester United Hub — club info page mock data.
 *
 * Reconciled 1:1 against the design source's `window.CLUB_DATA`
 * (`.design-ref/club-data.js` in the harness project, manu-united-club).
 * Values below (identity·summary·history·manager·stadium·lineup·subs) are
 * copied verbatim from that file — do not hand-edit text/numbers here without
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
  SquadPlayer,
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

// ───────── Summary (8) ─────────

export const summaryCards: SummaryCard[] = [
  { icon: 'History', label: '창단연도', en: 'Founded', value: '1878', sub: 'Newton Heath LYR' },
  { icon: 'MapPin', label: '연고지', en: 'Location', value: '맨체스터', sub: '잉글랜드 트래포드' },
  { icon: 'Building2', label: '홈구장', en: 'Stadium', value: '올드 트래포드', sub: '74,310석' },
  { icon: 'Trophy', label: '리그', en: 'League', value: '프리미어리그', sub: '1부 · 잉글랜드' },
  { icon: 'Crown', label: '구단주', en: 'Owner', value: 'INEOS · 글레이저', sub: '지분 공동' },
  { icon: 'User', label: '감독', en: 'Manager', value: '뤼번 아모림', sub: '2024.11 부임' },
  { icon: 'Globe', label: 'UEFA 랭킹', en: 'UEFA Rank', value: '#14', sub: '클럽 계수' },
  { icon: 'BarChart3', label: '시즌 순위', en: 'League Pos.', value: '8위', sub: '2025/26 · 진행 중' },
];

// ───────── History (10) ─────────

export const historyEvents: HistoryEvent[] = [
  { year: '1878', title: '뉴턴 히스 LYR 창단', desc: '랭커셔·요크셔 철도 노동자들이 구단을 결성.', tag: '창단' },
  { year: '1902', title: '맨체스터 유나이티드로 개명', desc: '파산 위기에서 J.H. 데이비스의 투자로 구단명을 바꿈.', tag: '전환점' },
  { year: '1910', title: '올드 트래포드 개장', desc: "'꿈의 극장' 홈구장으로 이전.", tag: '홈구장' },
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
  name: '뤼번 아모림',
  en: 'Rúben Amorim',
  nat: '포르투갈',
  flag: 'pt',
  role: '감독 · Head Coach',
  appointed: '2024년 11월',
  contract: '2027년 6월까지',
  age: '41세',
  preferred: '3-4-2-1',
  style: ['강한 전방 압박', '윙백 활용 빌드업', '스리백 기반'],
  record: { p: 38, w: 19, d: 9, l: 10 },
  prevClubs: ['스포르팅 CP', '브라가', '카자 피아'],
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
    { icon: 'User', label: '수용 인원', value: '74,310석' },
    { icon: 'History', label: '개장', value: '1910년' },
    { icon: 'Ruler', label: '피치 규격', value: '105 × 68 m' },
    { icon: 'TrendingUp', label: '최다 관중', value: '76,962명' },
  ],
};

// ───────── Squad ─────────
// lineup order is significant: lineup[i] pairs by index with
// FORMATIONS[name][i] in formations.ts ("11 players assigned in order to
// each formation's 11 slots" — source comment).

export const lineup: SquadPlayer[] = [
  { num: 24, nm: '오나나', en: 'Onana', role: 'GK' },
  { num: 20, nm: '달롯', en: 'Dalot', role: 'RB' },
  { num: 4, nm: '더 리흐트', en: 'de Ligt', role: 'CB' },
  { num: 6, nm: '마르티네스', en: 'Martínez', role: 'CB' },
  { num: 23, nm: '쇼', en: 'Shaw', role: 'LB' },
  { num: 18, nm: '카세미루', en: 'Casemiro', role: 'CM' },
  { num: 37, nm: '메이누', en: 'Mainoo', role: 'CM' },
  { num: 8, nm: '브루누 (C)', en: 'B. Fernandes', role: 'AM' },
  { num: 17, nm: '가르나초', en: 'Garnacho', role: 'RW' },
  { num: 11, nm: '회일룬', en: 'Højlund', role: 'ST' },
  { num: 10, nm: '래시포드', en: 'Rashford', role: 'LW' },
];

export const subs: SquadPlayer[] = [
  { num: 1, nm: '바인더', en: 'Bayındır', role: 'GK' },
  { num: 5, nm: '마괄리스', en: 'Maguire', role: 'DF' },
  { num: 2, nm: '요로', en: 'Yoro', role: 'DF' },
  { num: 14, nm: '에릭센', en: 'Eriksen', role: 'MF' },
  { num: 7, nm: '마운트', en: 'Mount', role: 'MF' },
  { num: 21, nm: '안토니', en: 'Antony', role: 'FW' },
  { num: 9, nm: '지르크지', en: 'Zirkzee', role: 'FW' },
];

// ───────── Sub tabs ─────────
// Mirrors club.jsx's TABS constant (component-local, not in club-data.js).

export const subTabs: SubTabMeta[] = [
  { id: 'history', kr: '연혁', en: 'History' },
  { id: 'highlights', kr: '하이라이트', en: 'Highlights', soon: true },
  { id: 'squad', kr: '선수정보', en: 'Squad' },
  { id: 'manager', kr: '감독', en: 'Manager' },
  { id: 'stadium', kr: '홈구장', en: 'Stadium' },
  { id: 'stats', kr: '팀통계', en: 'Stats', soon: true },
];

/**
 * Copy for the two `soon` sub tabs, rendered via EmptyTab (f_shared StateBox).
 * Supplementary — not present in club-data.js (see file header note).
 */
export const emptyTabCopy: Record<'highlights' | 'stats', EmptyTabCopy> = {
  highlights: { icon: 'Award', desc: '경기 하이라이트 영상은 준비 중입니다. 곧 만나보실 수 있어요.' },
  stats: { icon: 'BarChart3', desc: '시즌 팀 통계는 준비 중입니다. 곧 만나보실 수 있어요.' },
};
