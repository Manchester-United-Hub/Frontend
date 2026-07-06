/**
 * 뉴스 기사 목데이터 + 커서 페이지네이션 (#36, UI 목 전용).
 *
 * getNewsPage는 실제 서버 계약(NewsQuery → NewsPage, keyset 커서)을 미러링한다.
 * 추후 다른 브랜치에서 이 소스를 실 API(getNewsList)로 교체한다.
 */

import type { ArticleItem, NewsPage, NewsQuery } from './types';

/** 한 페이지 기사 수. */
export const NEWS_PAGE_SIZE = 9;

/** "더 이상 없음" 커서 센티널 — 실제 id는 양수이므로 0을 종료 신호로 쓴다. */
export const NO_MORE_CURSOR_ID = 0;

/** 최초 조회 커서 — 어떤 기사보다 최신인 경계값(전부 이보다 과거). */
export const makeInitialNewsQuery = (size: number = NEWS_PAGE_SIZE): NewsQuery => ({
  cursorAt: '9999-12-31T23:59',
  cursorId: Number.MAX_SAFE_INTEGER,
  size,
});

/** 최신순 정렬 비교자 — publishedAt 내림차순, 동시각은 id 내림차순. */
const compareNewestFirst = (
  a: { publishedAt: string; id: number },
  b: { publishedAt: string; id: number },
): number => {
  if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
  return b.id - a.id;
};

/** 커서보다 과거(피드에서 더 아래)인 기사인가. */
const isOlderThanCursor = (item: ArticleItem, query: NewsQuery): boolean =>
  compareNewestFirst({ publishedAt: query.cursorAt, id: query.cursorId }, item) < 0;

/**
 * 커서 이후 size개를 최신순으로 반환. 남은 게 더 있으면 마지막 아이템을 다음 커서로,
 * 없으면 nextCursorId를 센티널(0)로 설정한다.
 */
export const getNewsPage = (
  query: NewsQuery,
  list: ArticleItem[] = MOCK_NEWS,
): NewsPage => {
  const remaining = [...list].sort(compareNewestFirst).filter((n) => isOlderThanCursor(n, query));
  const newsList = remaining.slice(0, query.size);
  const last = newsList.at(-1);
  const hasMore = remaining.length > query.size;

  return {
    newsList,
    nextCursorAt: last ? last.publishedAt : query.cursorAt,
    nextCursorId: hasMore && last ? last.id : NO_MORE_CURSOR_ID,
  };
};

/** 썸네일 있는 기사용 — 결정적 목 이미지(추후 실 피드 이미지로 대체). */
const mockImage = (seed: string): string => `https://picsum.photos/seed/${seed}/640/360`;

/** 맨유 허브 뉴스 목데이터 (최신순). id가 클수록 최신. */
export const MOCK_NEWS: ArticleItem[] = [
  {
    id: 21,
    title: '회일룬 결승골, 맨유 리버풀 2-1 제압',
    description:
      '후반 추가시간 라스무스 회일룬의 헤더 결승골로 맨체스터 유나이티드가 안방에서 리버풀을 2-1로 꺾었다. 아모림 체제에서 달라진 경기 운영이 빛난 한 판이었다.',
    link: 'https://news.example.com/mu/liverpool-2-1',
    originalLink: 'https://original.example.com/mu/liverpool-2-1',
    publishedAt: '2025-05-18T22:45',
    imageUrl: mockImage('mu-liverpool'),
  },
  {
    id: 20,
    title: '아모림의 3-4-2-1, 무엇이 달라졌나',
    description:
      '윙백 운영과 전방 압박을 중심으로 한 새 전술 체계가 자리를 잡아가고 있다. 데이터로 보는 변화의 신호를 짚었다.',
    link: 'https://news.example.com/mu/amorim-shape',
    originalLink: 'https://original.example.com/mu/amorim-shape',
    publishedAt: '2025-05-14T10:00',
    imageUrl: mockImage('mu-amorim'),
  },
  {
    id: 19,
    title: '여름 이적시장, 맨유의 최우선 과제는 중원',
    description:
      '구단이 중앙 미드필더 보강을 여름 최우선 순위로 두고 있다는 분석이 나온다. 후보군과 예산 여력을 정리했다.',
    link: 'https://news.example.com/mu/transfer-midfield',
    originalLink: 'https://original.example.com/mu/transfer-midfield',
    publishedAt: '2025-05-10T09:30',
  },
  {
    id: 18,
    title: '"이곳에서 성장하고 싶다" — 코비 메이누 인터뷰',
    description:
      '데뷔 시즌을 마친 21세 미드필더가 팀과 자신의 미래에 대해 이야기했다. 캐링턴에서의 하루를 함께 들여다봤다.',
    link: 'https://news.example.com/mu/mainoo-interview',
    originalLink: 'https://original.example.com/mu/mainoo-interview',
    publishedAt: '2025-05-06T08:00',
    imageUrl: mockImage('mu-mainoo'),
  },
  {
    id: 17,
    title: '회일룬은 어떻게 해결사가 되었나',
    description:
      '시즌 후반 폼이 폭발한 덴마크 공격수. 슈팅 위치와 침투 움직임의 변화를 데이터로 살펴본다.',
    link: 'https://news.example.com/mu/hojlund-form',
    originalLink: 'https://original.example.com/mu/hojlund-form',
    publishedAt: '2025-05-02T11:20',
  },
  {
    id: 16,
    title: '맨체스터 더비 1-1 무승부, 절반의 만족',
    description:
      '치열했던 더비는 1-1로 끝났다. 양 팀의 키 포인트와 선수 평점, 그리고 남은 과제를 정리했다.',
    link: 'https://news.example.com/mu/derby-draw',
    originalLink: 'https://original.example.com/mu/derby-draw',
    publishedAt: '2025-04-13T23:10',
    imageUrl: mockImage('mu-derby'),
  },
  {
    id: 15,
    title: 'INEOS 체제 1년, 구조 개편의 현재 위치',
    description:
      '스포츠 부문 운영권 변경 이후 1년. 무엇이 바뀌었고 무엇이 과제로 남았는가를 짚었다.',
    link: 'https://news.example.com/mu/ineos-one-year',
    originalLink: 'https://original.example.com/mu/ineos-one-year',
    publishedAt: '2025-04-08T09:00',
  },
  {
    id: 14,
    title: '유스 아카데미에서 올라온 다음 세대는 누구',
    description:
      '캐링턴이 다시 주목받고 있다. 1군 진입을 노리는 유망주들의 현재 위치와 기대치를 소개한다.',
    link: 'https://news.example.com/mu/academy-next',
    originalLink: 'https://original.example.com/mu/academy-next',
    publishedAt: '2025-04-01T10:30',
    imageUrl: mockImage('mu-academy'),
  },
  {
    id: 13,
    title: '"수비는 팀 전체의 일" — 리산드로 마르티네스',
    description:
      '아르헨티나 수비수가 말하는 압박, 빌드업, 그리고 동료들. 부상 복귀 이후의 각오도 담았다.',
    link: 'https://news.example.com/mu/martinez-interview',
    originalLink: 'https://original.example.com/mu/martinez-interview',
    publishedAt: '2025-03-25T08:40',
  },
  {
    id: 12,
    title: '세트피스가 만든 승점, 숫자로 보다',
    description:
      '올 시즌 맨유의 세트피스 효율을 리그 평균과 비교했다. 코너킥 루틴의 변화가 만든 차이를 분석한다.',
    link: 'https://news.example.com/mu/set-piece',
    originalLink: 'https://original.example.com/mu/set-piece',
    publishedAt: '2025-03-18T12:00',
    imageUrl: mockImage('mu-setpiece'),
  },
  {
    id: 11,
    title: '올드 트래포드 재개발 논의, 어디까지 왔나',
    description:
      '홈구장의 미래를 둘러싼 여러 시나리오를 정리했다. 신축과 리모델링 사이, 구단의 고민을 들여다본다.',
    link: 'https://news.example.com/mu/old-trafford',
    originalLink: 'https://original.example.com/mu/old-trafford',
    publishedAt: '2025-03-11T09:15',
  },
  {
    id: 10,
    title: '가르나초, 시즌 베스트 골 후보에 이름 올려',
    description:
      '알레한드로 가르나초의 시저스킥이 올해의 골 후보에 올랐다. 그의 폭발적인 성장 곡선을 되짚었다.',
    link: 'https://news.example.com/mu/garnacho-goal',
    originalLink: 'https://original.example.com/mu/garnacho-goal',
    publishedAt: '2025-03-04T20:00',
    imageUrl: mockImage('mu-garnacho'),
  },
  {
    id: 9,
    title: '오나나, 연속 선방으로 승점 지켜',
    description:
      '앙드레 오나나가 결정적인 선방을 연달아 막아내며 팀의 승점을 지켰다. 골키퍼 지표로 본 그의 반등.',
    link: 'https://news.example.com/mu/onana-saves',
    originalLink: 'https://original.example.com/mu/onana-saves',
    publishedAt: '2025-02-24T22:30',
  },
  {
    id: 8,
    title: '카세미루의 역할 변화, 중원의 무게추',
    description:
      '수비형 미드필더에서 빌드업 조율자로. 카세미루의 역할 재정의가 팀 균형에 미친 영향을 분석했다.',
    link: 'https://news.example.com/mu/casemiro-role',
    originalLink: 'https://original.example.com/mu/casemiro-role',
    publishedAt: '2025-02-17T11:00',
    imageUrl: mockImage('mu-casemiro'),
  },
  {
    id: 7,
    title: '브루누 페르난데스, 주장으로서의 시즌',
    description:
      '기록을 넘어선 리더십. 주장 완장을 찬 브루누가 팀에 남긴 것들을 인터뷰와 데이터로 조명한다.',
    link: 'https://news.example.com/mu/bruno-captain',
    originalLink: 'https://original.example.com/mu/bruno-captain',
    publishedAt: '2025-02-09T09:45',
  },
  {
    id: 6,
    title: '겨울 이적시장 결산, 맨유의 선택',
    description:
      '영입과 방출을 정리하며 구단의 스쿼드 전략을 읽는다. 남은 여름을 향한 밑그림도 함께 살폈다.',
    link: 'https://news.example.com/mu/winter-window',
    originalLink: 'https://original.example.com/mu/winter-window',
    publishedAt: '2025-02-03T18:20',
    imageUrl: mockImage('mu-window'),
  },
  {
    id: 5,
    title: '달롯의 꾸준함, 저평가된 풀백',
    description:
      '조용하지만 확실하게. 디오구 달롯이 양쪽 풀백을 오가며 보여준 안정감을 수치로 확인했다.',
    link: 'https://news.example.com/mu/dalot-fullback',
    originalLink: 'https://original.example.com/mu/dalot-fullback',
    publishedAt: '2025-01-27T10:10',
  },
  {
    id: 4,
    title: '아모림 부임 후 첫 100일 리뷰',
    description:
      '성적, 전술, 드레싱룸까지. 새 감독의 첫 100일을 세 가지 키워드로 정리해 되짚었다.',
    link: 'https://news.example.com/mu/amorim-100days',
    originalLink: 'https://original.example.com/mu/amorim-100days',
    publishedAt: '2025-01-20T09:00',
    imageUrl: mockImage('mu-100days'),
  },
  {
    id: 3,
    title: '래시포드의 재발견, 위치를 바꾸다',
    description:
      '측면에서 중앙으로. 마커스 래시포드의 포지션 실험이 만들어낸 기회와 과제를 짚었다.',
    link: 'https://news.example.com/mu/rashford-role',
    originalLink: 'https://original.example.com/mu/rashford-role',
    publishedAt: '2025-01-13T11:30',
  },
  {
    id: 2,
    title: '새해 첫 승, 분위기 반등의 신호탄',
    description:
      '새해 첫 경기를 승리로 장식하며 팀 분위기가 살아났다. 경기 흐름과 교체 카드의 효과를 분석한다.',
    link: 'https://news.example.com/mu/new-year-win',
    originalLink: 'https://original.example.com/mu/new-year-win',
    publishedAt: '2025-01-04T23:05',
    imageUrl: mockImage('mu-newyear'),
  },
  {
    id: 1,
    title: '시즌 전반기 결산, 숫자로 본 맨유',
    description:
      '득점, 실점, 기대득점까지. 전반기 성적표를 데이터로 총정리하며 후반기 관전 포인트를 제시한다.',
    link: 'https://news.example.com/mu/first-half-review',
    originalLink: 'https://original.example.com/mu/first-half-review',
    publishedAt: '2024-12-28T10:00',
  },
];
