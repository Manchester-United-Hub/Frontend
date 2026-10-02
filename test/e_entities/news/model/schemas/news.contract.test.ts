import { describe, it, expect } from 'vitest';
import { NewsListDTOSchema } from '@entities/news/model/schemas/news';

/**
 * 계약 테스트(H-2 최소 조치, NW-4) — 지어낸 값이 아니라 실 API 응답을 그대로 고정한다.
 *
 * fixture 출처: `GET https://www.manuhub.kro.kr/api/news` 실측(2026-08-03 캡처).
 * - 중간 페이지: `?size=3` 응답(유효한 nextCursorId/nextCursorAt).
 * - 종료 페이지: 마지막 실데이터 페이지 다음 커서로 호출한 응답
 *   (`newsList: []`, `nextCursorId: null`, `nextCursorAt: null` — review-NW.md C-2 실측과 일치).
 *
 * 목적: `NewsListDTOSchema`와 실 API 계약이 어긋나면(예: 필드 추가/제거, null 규약 변경)
 * 이 테스트가 즉시 실패해 "전부 통과인데 화면은 안 뜬다"(H-2)를 막는다.
 */

const middlePageFixture = {
  newsList: [
    {
      id: 59,
      title:
        '"K리그 잔디에서도 빌드업하는 건 대단한 거야! 민재가 후보라고 마음대...',
      description:
        '콩파니 감독은 기자회견 전날 제주SK와 인천유나이티드가 3-3으로 비긴 K리그1 경기를 관전했다. 콩파니... 맨체스터시티 수비수로서 경쟁은 일상이었다. 중요한 건 경기장에서 능력을 보여주는 것이다. 김민재는 집중하는... ',
      link: 'https://m.sports.naver.com/wfootball/article/436/0000111955',
      originalLink:
        'http://www.footballist.co.kr/news/articleView.html?idxno=213068',
      publishedAt: '2026-08-03T18:17',
    },
    {
      id: 58,
      title: '김민재, 잔류에 대해 직접 입 열었다 "이적? 감독님이 뛰게 해 주시겠지...',
      description:
        '- 어제 제주SK 대 인천유나이티드 K리그1 경기(3-3)를 관전했는데, 수준과 추구하는 방향이 어때 보였나 콩... 맨체스터시티 수비수로서 경쟁은 일상이었다. 중요한 건 경기장에서 능력을 보여주는 것이다. 김민재는 집중하는... ',
      link: 'https://m.sports.naver.com/wfootball/article/436/0000111953',
      originalLink:
        'http://www.footballist.co.kr/news/articleView.html?idxno=213065',
      publishedAt: '2026-08-03T18:04',
    },
    {
      id: 57,
      title: '‘이적설 일축’ 김민재 “뮌헨에 남을 것 같다” [쿠키 현장]',
      description:
        '콤파니 감독은 입국 당일인 2일 제주월드컵경기장을 찾아 제주와 인천 유나이티드의 K리그1 경기를 직접... 콤파니 감독은 “저는 선수들 간의 경쟁을 굉장히 중요하게 여기는 감독”이라며 “맨체스터 시티 시절... ',
      link: 'https://www.kukinews.com/article/view/kuk202608030170',
      originalLink: 'https://www.kukinews.com/article/view/kuk202608030170',
      publishedAt: '2026-08-03T17:46',
    },
  ],
  nextCursorId: 57,
  nextCursorAt: '2026-08-03T17:46',
};

const endOfFeedFixture = {
  newsList: [],
  nextCursorId: null,
  nextCursorAt: null,
};

describe('NewsListDTOSchema — 실 API 계약 고정', () => {
  it('중간 페이지 실 응답(newsList 3건 + 유효 커서)을 통과시킨다', () => {
    expect(NewsListDTOSchema.safeParse(middlePageFixture).success).toBe(true);
  });

  it('종료 페이지 실 응답(빈 newsList + null 커서)을 통과시킨다', () => {
    expect(NewsListDTOSchema.safeParse(endOfFeedFixture).success).toBe(true);
  });

  it('nextCursorId가 숫자도 null도 아니면 실패한다', () => {
    const invalid = { ...endOfFeedFixture, nextCursorId: 'null' };
    expect(NewsListDTOSchema.safeParse(invalid).success).toBe(false);
  });
});
