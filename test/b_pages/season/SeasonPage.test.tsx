/**
 * SeasonPage 테스트 — 최소 조립 계약(decision-1.md §5 / plan.json ST-09 명시 선택지).
 *
 * ST-05로 SeasonPage가 async 서버 컴포넌트가 되면서(`export async function SeasonPage()`),
 * 기존에 이 파일이 갖고 있던 QueryClientProvider + RTL render() 기반 통합 테스트는
 * 더 이상 성립하지 않는다(S-16 — jsdom은 async 서버 컴포넌트를 렌더할 수 없고,
 * SchedulePanel·StandingsPanel도 각각 async 서버 컴포넌트라 자식까지 내려가며 렌더가
 * 불가능하다). 그래서 이 파일을 삭제하지 않고, RTL 렌더에 의존하지 않는 최소 계약
 * 테스트로 축소했다(plan.json ST-09가 명시한 두 선택지 "삭제" vs "최소 테스트로 축소"
 * 중 후자 — test/가 src/를 미러링한다는 S-15 기본값을 최대한 지키기 위해서다).
 *
 * 사라진 커버리지의 행방 (R-8):
 * - "초기 탭 = matches, tablist/tab 2개·tabpanel 1개" → SeasonTabs.test.tsx(ST-08)가
 *   matchesPanel/standingsPanel에 더미 ReactNode를 slot으로 주입해 검증한다(a11y 계약 포함).
 * - "탭 전환 시 접근성 계약이 짝을 이루고 활성 patternPanel만 렌더" → 동일하게
 *   SeasonTabs.test.tsx(ST-08)가 담당한다.
 * - "홈 필터 선택 시 일정 패널 행 수 감소" → MatchTab.test.tsx(ST-08)가 matches를 props로
 *   직접 주입해 필터 상호작용 커버리지를 그대로(축소 없이) 유지한다.
 * - "순위표 탭 전환 시 테이블 렌더" → StandingsTab.test.tsx(ST-08)가 standings를 props로
 *   주입해 검증한다.
 * - getSeasonInfo·getStandings·getSchedule 각 데이터 계층의 성공/실패/복구 경로는
 *   getSeasonInfo.test.ts·getStandings.test.ts·getSchedule.test.ts(ST-09, 이 폴더)가 담당한다.
 * - 다만 "SeasonPage가 getSeasonInfo()의 label·status를 SeasonHeader에 실제로 연결하고,
 *   SeasonTabs에 SchedulePanel·StandingsPanel을 올바른 slot(matchesPanel/standingsPanel)에
 *   배선한다"는 조립 그 자체(각 조각을 실제로 잘못된 자리에 연결하는 실수)는 어떤 단위
 *   테스트로도 커버되지 않는다 — 이 지점이 async 서버 컴포넌트라 jsdom에서 렌더할 수
 *   없기 때문이다(R-8 defense). 이 조립 검증은 qa-engineer의 next build && next start
 *   실행 검증(브라우저/curl로 /season 실제 렌더 확인)에 전적으로 의존한다. 체크포인트
 *   B에서 이 실행 검증이 실제로 수행됐는지 반드시 확인해야 한다.
 *
 * [2차 개정 — ST2-03] SeasonPage가 season을 1회 조회해 세 패널(SchedulePanel·
 * StandingsPanel·SummaryPanel)에 seasonLabel·seasonStartYear 원시값 props로 내려주는
 * 트랜잭션 배선(B-3/D-14)과, SummaryCards 직접 렌더를 Suspense+SummaryPanel slot으로
 * 교체한 배선(S2-5)도 위와 같은 이유로 이 파일의 어떤 단위 테스트로도 커버되지 않는다.
 * D-14의 구조적 보장은 ST2-03 DoD 2번(grep -rn "getSeasonInfo" src/b_pages/season/ui/
 * = 0건, S2-10)의 정적 검사와 DoD 3~8번의 런타임 실측(업스트림 호출 횟수·실패 주입
 * dedup)이 담당하며, SummaryPanel slot 배선은 qa-engineer의 실행 검증에 의존한다.
 * SummaryPanel의 실패 흡수 경로(getStandings === null → toSeasonSummaryCards의
 * 플레이스홀더 4장)도 파생 함수 단위에서만 검증되고 패널 수준에서는 무검증이다
 * (async 서버 컴포넌트라 jsdom 렌더 불가 — S-16). 1줄 배선이라 위험은 낮으며
 * F-19로 등록했다(decision-3 §5 T9).
 *
 * 검증 목적 (이 파일에 남긴 것 — RTL 렌더 없이 가능한 범위):
 * - SeasonPage가 async 함수로 export된다(서버 컴포넌트 시그니처 회귀 방지 — 누군가
 *   실수로 동기 함수로 되돌리면 이 테스트가 실패한다).
 * - 모듈 import 자체가 부수효과 에러 없이 성공한다(순환참조·잘못된 배럴 경로 등
 *   조립 실수의 일부는 import 시점에 즉시 드러난다).
 */

import { describe, it, expect } from 'vitest';

import { SeasonPage } from '@pages/season';

describe('SeasonPage — 최소 조립 계약(S-16: async 서버 컴포넌트는 RTL로 렌더하지 않는다)', () => {
  it('async 함수로 export된다', () => {
    expect(typeof SeasonPage).toBe('function');
    expect(SeasonPage.constructor.name).toBe('AsyncFunction');
  });
});
