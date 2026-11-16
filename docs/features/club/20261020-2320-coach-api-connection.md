# 구단 페이지 감독 API 연결 설계

- 일시: 2026-10-20 23:20
- 이슈: #74 [Feature] 감독 API 연결
- 브랜치: `feature/connect-coach-api-in-club-page`

## 1. 목표

구단 페이지 감독 탭(`ManagerTab`)의 데이터 소스를 `mockData.manager`에서 실 API(`GET /api/coaches/{teamId}`)로 교체한다.

## 2. API 계약

`GET /api/coaches/33` (operationId `getCoach`)

실측 응답 (2026-10-20):

```json
{
  "id": 25762,
  "teamId": 33,
  "name": "Michael Carrick",
  "photo": "https://pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev/coaches/25762.png",
  "birthDate": null,
  "birthPlace": null,
  "appointmentDate": "2025-08-01",
  "contractEndDate": null,
  "nationality": null,
  "careers": [{ "startDate": "2025-08-01", "endDate": null, "team": "Manchester United" }]
}
```

Swagger는 모든 필드를 `string`으로 표기하지만 실측상 `null`이 온다. **스키마는 실측 기준으로 nullable을 적용한다.**

| 필드 | Swagger | 실측 | zod |
|---|---|---|---|
| id, teamId | int64 | number | `z.number()` |
| name | string | string | `z.string()` |
| photo | string | URL | `z.httpUrl().nullable()` |
| birthDate, birthPlace, appointmentDate, contractEndDate, nationality | string | null 가능 | `z.string().nullable()` |
| careers[].startDate, team | string | string | `z.string()` |
| careers[].endDate | string | null(현직) | `z.string().nullable()` |

## 3. 결정 사항

| # | 항목 | 결정 |
|---|---|---|
| D-1 | 이름 | API 영문 이름을 그대로 표시한다. 한글 이름 매핑은 두지 않는다. |
| D-2 | API 실패 시 | 감독 탭에 `StateBox`로 "감독 정보를 불러오지 못했어요" 빈 상태를 표시한다. 목 데이터로 대체하지 않는다. |
| D-3 | 사진 | 실루엣 자리에 `next/image`로 `photo`를 렌더한다. `photo`가 null이면 기존 `Silhouette`을 유지한다. |
| D-4 | 이미지 도메인 | `pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev`는 선수 사진용으로 `next.config.ts`에 **이미 등록**되어 있다(감독 사진도 같은 버킷). 설정 변경 없음. |
| D-5 | null 필드 표시 | 값이 null이면 `-`로 표시한다. |
| D-6 | 데이터 조회 위치 | `app/club/page.tsx`(async)에서 `loadManager`를 호출해 `ClubPage`에 props로 넘긴다. async `ClubPage`는 테스트(React 클라이언트 렌더)에서 렌더할 수 없어 라우트로 올렸다(app/page·players/page와 동일 패턴). props 전달은 `ClubPage → ClubTabs → ManagerTab`이라 Context는 쓰지 않는다. |
| D-7 | 캐시 | `app/club/page.tsx`에 `export const revalidate = 3600` (players 페이지와 동일 ISR). |
| D-8 | 응답 검증 | `toServerApiResult`로 zod 검증. 계약 불일치 시 502 `UPSTREAM_CONTRACT_MISMATCH` → D-2 경로. `serverFetcher` 타임아웃 throw도 D-2 경로로 흡수한다. |
| D-9 | 요약 카드 | 요약 카드의 감독 카드도 API 값으로 바꾼다. `value` = 영문 이름, `sub` = `{부임} 부임`. 실패 시 둘 다 `-`. 정적 5장(`mockData.summaryCards`) 뒤에 `buildCoachSummaryCard(manager)`를 붙인다. |
| D-10 | FlagSwatch | 국가 코드가 없어 렌더하지 않지만 파일과 테스트는 남겨둔다(#35 공통 국기 컴포넌트에서 정리). |

## 4. 데이터 흐름

```
app/club/page.tsx (async, revalidate 3600)
  ├ loadManager()                     ← b_pages/clubInfo/api
  │   ├ fetchCoach(33)                ← e_entities/coach/api/server
  │   └ mapCoachToManager(dto)        ← b_pages/clubInfo/model (순수 함수)
  └ ClubPage manager={Manager | null}
      ├ SummaryCards (정적 5장 + buildCoachSummaryCard)
      └ ClubTabs manager                ('use client')
          └ ManagerTab manager={Manager | null}
              ├ null  → StateBox (D-2)
              └ Manager → ManagerFacts · ManagerPhoto · ManagerCareer
```

## 5. 화면 모델 (`b_pages/clubInfo/model/types.ts`)

```ts
interface ManagerCareerEntry {
  team: string;
  /** "2025.08 – 현재" 형식 */
  period: string;
  now: boolean;
}

interface Manager {
  name: string;          // 영문 이름 (D-1)
  photo: string | null;  // D-3
  role: string;          // "감독 · Head Coach" (상수)
  appointed: string;     // "2025년 8월" | "-"
  born: string;          // "1981년 7월 28일" | "-"
  birthplace: string;    // 원문 | "-"
  contract: string;      // "2028년 6월까지" | "-"
  nationality: string;   // 원문 | "-"
  careers: ManagerCareerEntry[]; // 최신순
}
```

제거 필드: `en`(D-1로 name과 중복), `nat`·`flag`(→ `nationality`), `prevClubs`(→ `careers`).

### 매핑 규칙 (`mapCoachToManager`)

- 날짜 문자열(`YYYY-MM-DD`)은 문자열 분해로 포맷한다(타임존 영향 제거, `new Date` 미사용).
- `careers`는 `startDate` 내림차순 정렬, `endDate === null`이면 `now: true`이고 period 끝을 `현재`로 표시.

## 6. 변경 파일

| 계층 | 파일 | 변경 |
|---|---|---|
| f_shared | `api/configs/index.ts` | `API_PATH.coach(teamId)` 추가 |
| e_entities | `coach/model/schemas/coach.ts`, `schemas/index.ts` | `CareerDTOSchema`, `CoachDTOSchema` |
| e_entities | `coach/model/type.ts`, `model/index.ts` | `CareerDTO`, `CoachDTO` |
| e_entities | `coach/api/server/coach.ts`, `server/index.ts` | `fetchCoach(teamId)` |
| e_entities | `coach/configs/index.ts` | `MANCHESTER_UNITED_TEAM_ID = 33` |
| b_pages | `clubInfo/model/types.ts` | `Manager` 재정의(§5) |
| b_pages | `clubInfo/model/mapCoachToManager.ts` | DTO → `Manager` 순수 함수 |
| b_pages | `clubInfo/model/mockData.ts` | `manager` 목 데이터 제거 |
| b_pages | `ui/ManagerTab/ManagerTab.tsx` | `Manager \| null` 수용, 실패 시 StateBox |
| b_pages | `ui/ManagerTab/ManagerPhoto.tsx` (신규) | `next/image` / Silhouette 폴백 |
| b_pages | `ui/ManagerTab/ManagerFacts.tsx` | 국적 행을 `nationality` 텍스트로 |
| b_pages | `ui/ManagerTab/ManagerCareer.tsx` | `CURRENT_CLUB_*` 상수 제거, `careers` 렌더 |
| b_pages | `ui/ClubTabs/ClubTabs.tsx` | `manager` prop, manager 패널은 렌더 시점 생성 |
| b_pages | `clubInfo/api/loadManager.ts` (신규) | `fetchCoach` → `Manager \| null` (실패·throw → null) |
| b_pages | `clubInfo/model/buildCoachSummaryCard.ts` (신규) | `Manager \| null` → 감독 `SummaryCard` (D-9) |
| b_pages | `ClubPage.tsx` | `manager` prop 수용, 요약 카드 조립 |
| app | `club/page.tsx` | async + `loadManager`, `revalidate = 3600` |

## 7. 테스트 계획

| 파일 | 케이스 |
|---|---|
| `test/e_entities/coach/api/server/coach.test.ts` | 요청 경로, 성공, HTTP 실패, 스키마 불일치(502) |
| `test/b_pages/clubInfo/model/mapCoachToManager.test.ts` | null → `-`, 날짜 포맷, 경력 정렬·현직 표시, 빈 careers |
| `test/b_pages/clubInfo/ui/ManagerTab/ManagerPhoto.test.tsx` | photo 있음 → img(alt), null → 실루엣, 로드 실패 → 실루엣 |
| `test/b_pages/clubInfo/api/loadManager.test.ts` | 성공 → Manager, 실패 → null, throw → null |
| `test/b_pages/clubInfo/model/buildCoachSummaryCard.test.ts` | Manager → 이름·부임, null → `-` |
| 기존 `ManagerTab`·`ManagerFacts`·`ManagerCareer`·`ClubTabs`·`ClubPage` 테스트 | 새 모델로 픽스처 교체, `fetchCoach` mock. 단언 완화 금지 |

완료 조건: `pnpm exec tsc --noEmit` · `pnpm exec eslint` · `pnpm test` 통과, 분기 커버리지 80% 이상.

## 8. 커밋 계획

파일 단위 커밋을 원칙으로 하되, 각 커밋 시점에 타입 검사가 깨지지 않도록 순서를 정한다.
husky 규칙상 `docs` 타입이 없어 문서는 `chore`로 커밋한다.

1. `chore: add coach api connection design doc #74`
2. `feat: add coach api path #74`
3. `feat: add coach dto schema #74`
4. `feat: add coach dto types #74`
5. `feat: add manchester united team id config #74`
6. `feat: add coach server fetcher #74`
7. `feat: add manager photo component #74`
8. `refactor: connect manager tab to coach api #74` — `types.ts`·`mapCoachToManager.ts`·`loadManager.ts`·`mockData.ts`(manager 제거)·`ManagerTab`·`ManagerFacts`·`ManagerCareer`·`ClubTabs`·`ClubPage`는 타입이 연쇄로 묶여 있어 하나의 원자적 커밋으로 묶는다(분리 시 중간 커밋이 tsc 실패).
9. `feat: build coach summary card from api #74` — `buildCoachSummaryCard.ts`·`mockData.ts`(감독 카드 제거)·`ClubPage`
10. `feat: revalidate club page hourly #74`
11. 이후 테스트 파일별 `test: ... #74`

> 코드 단계(2~9) 동안 기존 테스트는 실패 상태다. pre-push 훅이 테스트를 돌리므로 테스트 단계 완료 전에는 push하지 않는다.
