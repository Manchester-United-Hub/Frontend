/**
 * flagCode → emoji 매핑 (ADR-4) — production 상수. `RosterGrid`/`RosterListRow`가 국기 글리프를
 * 렌더할 때 소비한다. 국가명 텍스트가 접근성을 담당하므로 이 값은 소비처에서 aria-hidden으로
 * 렌더한다. 웨일스(wa)는 국가가 아닌 subdivision emoji를 사용.
 *
 * 현재 `mapPlayerDtoToListItem`은 `flagCode`를 항상 `undefined`로 매핑하므로(API에 대응 필드
 * 없음, D-8) 실사용 시 글리프가 그려지는 경우는 없지만, 룩업 자체는 국적→국기 코드 갭이 해소되면
 * 즉시 재사용된다.
 */

export const FLAG_EMOJI: Record<string, string> = {
  pt: '🇵🇹',
  gb: '🇬🇧',
  dk: '🇩🇰',
  ar: '🇦🇷',
  cm: '🇨🇲',
  nl: '🇳🇱',
  br: '🇧🇷',
  fr: '🇫🇷',
  wa: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
};
