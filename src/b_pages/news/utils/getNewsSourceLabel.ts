const SOURCE_LABEL_BY_HOST: Record<string, string> = {
  'sports.naver.com': '네이버 스포츠',
  'news.naver.com': '네이버 뉴스',
  'stoo.com': '스포츠투데이',
};

const STRIPPED_HOST_PREFIXES = ['www.', 'm.'] as const;

/**
 * 호스트명 선행 접두사(`www.`, `m.`)를 반복 제거해 정규화한다.
 */
const stripHostPrefixes = (host: string): string => {
  let normalizedHost = host;
  let matchedPrefix = STRIPPED_HOST_PREFIXES.find((prefix) =>
    normalizedHost.startsWith(prefix)
  );

  while (matchedPrefix) {
    normalizedHost = normalizedHost.slice(matchedPrefix.length);
    matchedPrefix = STRIPPED_HOST_PREFIXES.find((prefix) =>
      normalizedHost.startsWith(prefix)
    );
  }

  return normalizedHost;
};

/**
 * 뉴스 기사 링크의 호스트명으로부터 출처 라벨을 파생한다.
 * 매핑 테이블에 있으면 해당 라벨을, 없으면 정규화된 호스트명을 그대로 반환한다.
 * 파싱할 수 없는 링크는 빈 문자열을 반환한다.
 */
const getNewsSourceLabel = (link: string): string => {
  try {
    const normalizedHost = stripHostPrefixes(new URL(link).hostname.toLowerCase());
    return SOURCE_LABEL_BY_HOST[normalizedHost] ?? normalizedHost;
  } catch {
    return '';
  }
};

export { getNewsSourceLabel };
