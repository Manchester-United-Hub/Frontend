/** 커서 페이지네이션 캐시 키를 구분하는 최소 파라미터 — size가 바뀌면 별도 캐시로 취급한다. */
interface NewsInfiniteBaseParams {
  size: number;
}

const newsKeys = {
  all: ['news'] as const,
  infiniteList: (baseParams: NewsInfiniteBaseParams) =>
    [...newsKeys.all, 'infiniteList', baseParams] as const,
};

export { newsKeys };
export type { NewsInfiniteBaseParams };
