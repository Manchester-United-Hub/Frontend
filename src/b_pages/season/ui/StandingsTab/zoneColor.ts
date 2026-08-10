import { StandingZone } from '@entities/rank/model';

/**
 * 존(zone) 색 매핑 — 사전 결정 (테크리드 지시사항, plan.md).
 *
 * `ucl`→`bg-win`, `releg`→`bg-united-red` 는 기존 manuhub 토큰을 그대로 재사용한다.
 * `uel`(#2a6fdb)·`conf`(#7c5cd6)는 design-ref 범례 전용 장식색으로, 대응하는
 * manuhub 토큰이 없다. 토큰 신규 승격은 하지 않기로 결정했으므로(범례 전용,
 * 재사용 범위가 이 페이지 하나뿐), raw hex를 이 모듈 1곳에 명명 상수로 고정해
 * hex 리터럴이 여러 파일에 산개하는 것을 막는다(code-quality.md "매직 넘버·문자열은
 * 상수로 분리"). posbar(StandingsRow)·swatch(ZoneLegend) 양쪽이 `getZoneColorStyle`을
 * 통해서만 이 값을 소비한다 — result-ST-02.md에 결정 사유 기록.
 */
const ZONE_HEX: Partial<Record<StandingZone, string>> = {
  uel: '#2a6fdb',
  conf: '#7c5cd6',
};

const ZONE_TOKEN_CLASS: Partial<Record<StandingZone, string>> = {
  ucl: 'bg-win',
  releg: 'bg-united-red',
};

export interface ZoneColorStyle {
  /** manuhub 토큰이 있는 존(ucl·releg)에만 채워진다. */
  className?: string;
  /** 토큰이 없는 존(uel·conf)에만 채워진다 — raw hex는 이 함수 내부로 국한. */
  style?: { backgroundColor: string };
}

/** zone → 배경색 스타일. zone `''`(no zone)은 둘 다 비워 transparent로 렌더된다. */
export const getZoneColorStyle = (zone: StandingZone): ZoneColorStyle => {
  const tokenClass = ZONE_TOKEN_CLASS[zone];
  if (tokenClass) return { className: tokenClass };

  const hex = ZONE_HEX[zone];
  if (hex) return { style: { backgroundColor: hex } };

  return {};
};
