import type { FooterColumn } from './types';

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: '둘러보기',
    links: [
      { label: '시즌', href: '/season' },
      { label: '선수', href: '/players' },
      { label: '구단', href: '/club' },
      // 1.0.0 릴리스 제외 — 하이라이트 실 API 연동 후 복구
      // { label: '하이라이트', href: '/highlights' },
    ],
  },
  {
    heading: '더보기',
    links: [{ label: '기사', href: '/news' }],
  },
];

export { FOOTER_COLUMNS };
