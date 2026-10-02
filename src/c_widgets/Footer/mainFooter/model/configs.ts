import type { FooterColumn } from './types';

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: '둘러보기',
    links: [
      { label: '시즌', href: '/season' },
      { label: '선수', href: '/players' },
      { label: '구단', href: '/club' },
      { label: '하이라이트', href: '/highlights' },
    ],
  },
  {
    heading: '더보기',
    links: [{ label: '기사', href: '/news' }],
  },
];

export { FOOTER_COLUMNS };
