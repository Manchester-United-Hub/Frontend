import { NavItem } from './types';

const NAV_ITEMS: NavItem[] = [
  {
    id: 'season',
    label: '시즌',
    labelEn: 'Season',
    href: '/season',
    description: '일정·결과·순위표를 한눈에 추적',
  },
  {
    id: 'players',
    label: '선수',
    labelEn: 'Players',
    href: '/players',
    description: '현역·역대 선수 기록과 프로필',
  },
  {
    id: 'club',
    label: '구단',
    labelEn: 'Club',
    href: '/club',
    description: '연혁·홈구장·팀 통계와 감독',
  },
  {
    id: 'highlights',
    label: '하이라이트',
    labelEn: 'Highlights',
    href: '/highlights',
    description: '경기 영상과 베스트 순간 모음',
  },
  {
    id: 'news',
    label: '기사',
    labelEn: 'NEWS',
    href: '/news',
    description: '팬이 정리한 소식과 분석 글',
  },
  {
    id: 'store',
    label: '공식 Store',
    labelEn: 'STORE',
    href: 'https://store.manutd.com/ko-kr',
    isOuterLink: true,
    description: '맨체스터 유나이티드 FC 공식 스토어',
  },
];

export { NAV_ITEMS };
