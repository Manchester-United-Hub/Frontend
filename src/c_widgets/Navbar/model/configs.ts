import { NavItem } from './types';

const NAV_ITEMS: NavItem[] = [
  { id: 'season', label: '시즌', labelEn: 'Season', href: '/season' },
  { id: 'players', label: '선수', labelEn: 'Players', href: '/players' },
  { id: 'club', label: '구단', labelEn: 'Club', href: '/club' },
  {
    id: 'highlights',
    label: '하이라이트',
    labelEn: 'Highlights',
    href: '/highlights',
  },
  { id: 'articles', label: '기사', labelEn: 'Articles', href: '/articles' },
];

export { NAV_ITEMS };
