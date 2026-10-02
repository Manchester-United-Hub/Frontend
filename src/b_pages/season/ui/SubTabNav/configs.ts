export type SubTabId = 'matches' | 'table';

export interface SubTabMeta {
  id: SubTabId;
  kr: string;
  en: string;
}

export const subTabs: SubTabMeta[] = [
  { id: 'matches', kr: '일정 & 결과', en: 'Matches' },
  { id: 'table', kr: '순위표', en: 'Table' },
];
