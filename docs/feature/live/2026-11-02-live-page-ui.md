# 라이브 페이지 UI

- 작성일: 2026-11-02
- 관련 이슈: #88
- 이전 문서: 없음

## 배경 · 목표

경기 중인 맨유 경기를 한 화면에서 따라가는 라이브 페이지(`/live`)를 만든다. 스코어보드 아래에 왼쪽은 라인업, 오른쪽은 텍스트 중계를 둔다.

- 이번 작업은 **UI만** 한다. 화면은 목데이터로 그린다.
- 나중에 SSE로 받을 데이터를 붙일 때 **구조는 그대로 두고 props만 바꾸면 되도록** 만든다.
  - 분 단위 중계 메시지 → 중계 피드 맨 위에 추가
  - 경기 중 교체(상대 팀 포함) → 피치와 명단에 반영

디자인 원본은 claude.ai/design 프로젝트의 통합형 시안이다(`hub-match-unified.jsx`, `ds/matchcenter.css`, `ds/matchcenter2.css`, `ds/club.css`의 피치·명단, `hub-shell.jsx`의 GNB). 분리형 시안(`hub-match-split.jsx`)은 쓰지 않는다.

### 범위

| 포함 | 제외 |
| --- | --- |
| `/live` 라우트, 경기 중/비경기 화면 분기 | SSE 연결, 조회, DTO → 화면 타입 변환 |
| 스코어보드 | 이벤트로 라인업을 다시 계산하는 로직 |
| 라인업 패널(맨유/상대 전환, 선발/후보 탭, 골·카드·교체 표시) | 새 중계 항목 등장 애니메이션(자리만 마련) |
| 텍스트 중계 패널(전체/맨유/상대 필터) | 스탯 줄, 포메이션 전환 버튼(분리형 시안 요소) |
| GNB 라이브 메뉴와 live dot | 모바일 메뉴(버거 버튼에 메뉴가 아직 없음) |

## 화면 · 컴포넌트 구성

```
┌──────────── LiveScoreboard ────────────┐
│ LIVE · 대회 · 경기장                      │
│ MUN 맨유  Home    2 – 1    Away 빌라 AVL  │
│                 후반 67'                 │
└────────────────────────────────────────┘
┌── LineupPane ──────┐ ┌── CommentaryPane ─────────┐
│ 선발 포지션 [맨유|상대] 4-3-3 │ │ 텍스트 중계 [전체|맨유|상대] │
│   (하프 피치, 토큰)   │ │ 맨유 ───── │ ───── 빌라   │
│ [선발 XI | 후보 7]   │ │ [버블] 67' │             │
│  명단 행…           │ │          65' │ [버블]       │
└────────────────────┘ └───────────────────────────┘
비경기: ClosedView ("경기중에만 오픈됩니다." + 시즌 일정 보기 / 홈으로)
```

| 레이어 | 위치 | 역할 |
| --- | --- | --- |
| app | `app/live/page.tsx` | `LivePage` 렌더 |
| b_pages | `b_pages/live/LivePage.tsx` | `status`로 경기 중/비경기 분기, 2단 배치 |
| b_pages | `b_pages/live/ui/LiveScoreboard/` | 스코어보드 |
| b_pages | `b_pages/live/ui/LineupPane/` | `LineupPane`, `Pitch`, `PitchLines`, `PlayerToken`, `PlayerMarks`, `RosterTabs`, `RosterRow` |
| b_pages | `b_pages/live/ui/CommentaryPane/` | `CommentaryPane`, `CommentaryFeedHead`, `CommentaryEvent`, `PeriodNote` |
| b_pages | `b_pages/live/ui/ClosedView/` | 비경기 화면 |
| b_pages | `b_pages/live/model/` | `types.ts`, `configs.ts`, `mockData.ts`, `toPitchPositions.ts`, `selectCommentary.ts` |
| c_widgets | `c_widgets/Navbar/` | `NAV_ITEMS`에 라이브 추가, live dot |
| d_features | — | 이번 작업 없음 (SSE 작업 때 추가) |
| e_entities | — | 이번 작업 없음 |
| f_shared | `utils/routes.ts`, `ui/tokens/colors.css` | `routes.live`, 피치·카드 색 토큰 |

- 이 페이지에서만 쓰므로 `b_pages/live`에 둔다. 다른 페이지에서 피치가 필요해지면 그때 위젯으로 올린다.
- `LivePage`, `LiveScoreboard`, `ClosedView`는 Server Component다. 상태가 있는 `LineupPane`, `CommentaryPane`만 `'use client'`다.

### 스코어보드

- `bg-united-red` 카드, `MU` 워터마크. 위쪽 줄에 `LIVE` 필(점은 `motion-safe:animate-pulse`) · 대회 · 경기장을 둔다.
- 3열: 홈(코드 박스, 이름, `Home`) / 스코어(`2 – 1`, 아래 `후반 67'`) / 원정(오른쪽 정렬).
- 스코어에만 `aria-live="polite"`를 둔다. 시계는 분마다 바뀌어 스크린리더가 계속 읽게 되므로 두지 않는다.

### 라인업 패널

- 헤더: `Line-ups` / `선발 포지션`. 오른쪽에 팀 전환 `SegmentedControl`(맨유/상대)과 포메이션 `Badge`를 둔다.
- 피치: `aspect-[68/92]` 하프 피치, 잔디 줄무늬와 SVG 라인. 자기 골문이 아래이고, 두 팀 모두 같은 방향으로 그린다.
- 토큰: 번호 원 + 이름. 맨유는 `bg-united-red`, 상대는 `bg-foreground text-background`, GK는 `bg-pitch-gk`.
- 토큰 오른쪽 위에 마크를 단다: 골(lucide `Goal`, 2골부터 숫자), 경고·퇴장(카드 칩), 교체 투입(`ArrowUp`, `text-win`).
- 명단: Headless UI `TabGroup`으로 `선발 XI` / `후보 N` 탭. 행은 번호 · 이름(영문 보조) · 포지션 칩이고, 오른쪽에 마크(`↓ 65'`, `↑ 65'`, 카드 칩, 골)를 둔다. 목록 높이는 최대 280px이고 넘치면 스크롤한다.

### 텍스트 중계 패널

- 헤더: `Live Text` / `텍스트 중계`. 오른쪽에 `SegmentedControl` 필터(전체/맨유/상대)를 둔다. 필터를 걸어도 중립 항목(경기 시작, 전반 종료 등)은 항상 보인다.
- 피드 머리: 왼쪽에 맨유, 오른쪽에 상대. 맨유는 홈/원정과 관계없이 항상 왼쪽이다(시안 그대로).
- 항목: 가운데 세로선 위에 시간 필, 해당 팀 쪽에 버블(아이콘 + 종류 + 본문). 골은 맨유 쪽 `united-red`, 상대 쪽 `foreground`로 강조한다. 중립 항목은 가운데 점선 필(`45+2' · 전반 종료. 맨유 1-0 리드.`)로 표시한다.
- 피드는 `<ol>`로 렌더한다. 최신 항목이 맨 위다.

| kind | 제목 | 아이콘 |
| --- | --- | --- |
| `goal` | 골 | `Goal` |
| `penalty` | 페널티킥 | `CircleDot` |
| `yellowCard` | 경고 | `RectangleVertical` |
| `redCard` | 퇴장 | `RectangleVertical` |
| `sub` | 교체 | `ArrowLeftRight` |
| `chance` | 찬스 | `Crosshair` |
| `period` | 진행 | `Clock` |

### 반응형

- 기본(모바일)은 1단(라인업 → 중계 순서), `lg:`부터 2단 `minmax(0,.95fr) minmax(0,1.05fr)`.
- 중계 타임라인은 기본에서 세로선을 왼쪽 레일로 옮기고 모든 버블을 한 열에 둔다. 상대 버블에는 왼쪽 3px 보더를 단다. `sm:`부터 가운데 세로선 배치로 바꾼다.
- 시안의 1080px·560px 대신 Tailwind 기본 breakpoint(`lg` 1024px, `sm` 640px)를 쓴다.

### 비경기 화면

- 시계 아이콘 원, `Match Centre`, `경기중에만 오픈됩니다.`, 안내 2줄을 둔다.
- 버튼은 `시즌 일정 보기`(red, `CalendarDays`) → `routes.season()`, `홈으로`(outline) → `routes.home()`.

### GNB

- `NAV_ITEMS` 맨 앞에 라이브를 추가한다: `{ id: 'live', label: '라이브', labelEn: 'Live', href: routes.live(), hasLiveIndicator: true, isHiddenInCategoryCards: true }`
- `Navbar`에 `isMatchLive?: boolean`(기본 `false`)을 추가한다. `NavLinkItem`은 `hasLiveIndicator`와 `isMatchLive`가 모두 참일 때 라벨 앞에 pulse dot(`aria-label="경기 진행 중"`)을 그린다. 실제 값은 SSE 작업에서 연결한다.
- 랜딩 `CategoryCardsSection`은 `NAV_ITEMS`를 그대로 카드로 그리므로 `isHiddenInCategoryCards`인 항목을 거른다. 카드 그리드(`lg:grid-cols-5`)가 6개로 깨지지 않게 하고, 시안 랜딩에도 라이브 카드는 없다.

## 데이터

| 항목 | 내용 |
| --- | --- |
| 백엔드 API | 이번 작업 없음. 이후 SSE + 기존 `LiveMatchLineupDTO`(`e_entities/matches`) |
| BFF 경로 | 이번 작업 없음 |
| schema / DTO | 이번 작업 없음. 화면 타입은 `b_pages/live/model/types.ts` |
| 조회 방식 | 목데이터 (`b_pages/live/model/mockData.ts`) |
| 캐시 수명 | 해당 없음 |

화면은 아래 타입만 받는다. SSE 작업에서 DTO와 SSE 메시지를 이 타입으로 바꾸는 `toXxx` 함수를 추가한다.

```ts
type MatchSide = 'united' | 'opponent';
type LiveStatus = 'live' | 'closed';

interface LiveTeam { name: string; code: string; score: number; isUnited: boolean }

interface LiveMatch {
  status: LiveStatus;
  competition: string;            // "프리미어리그 · 32라운드"
  venue: string;
  period: string;                 // "후반"
  clock: string;                  // "67'"
  home: LiveTeam;
  away: LiveTeam;
  lineups: Record<MatchSide, TeamLineup>;
  commentary: CommentaryEntry[];  // 최신순
}

type PlayerMarkType = 'goal' | 'yellowCard' | 'redCard' | 'subIn' | 'subOut';
interface PlayerMark { type: PlayerMarkType; minute: string }

interface LineupPlayer {
  id: number;
  number: number;
  name: string;
  nameEn: string;
  position: string;
  grid: string | null;            // "row:col" (API-Football 형식). 피치 위 선수만 값이 있다
  marks: PlayerMark[];
}

interface TeamLineup {
  formation: string;
  onPitch: LineupPlayer[];        // 지금 피치 위 11명 (교체 반영 후)
  starters: LineupPlayer[];       // 선발 XI (교체 아웃 선수 포함, subOut 마크)
  substitutes: LineupPlayer[];    // 후보 (투입 선수는 subIn 마크)
}

type CommentaryKind = 'goal' | 'penalty' | 'yellowCard' | 'redCard' | 'sub' | 'chance' | 'period';
interface CommentaryEntry {
  id: string;
  minute: string;                 // "45+2'"
  side: MatchSide | 'neutral';
  kind: CommentaryKind;
  text: string;
}
```

### 피치 좌표: `toPitchPositions(players)`

`grid`를 파싱해 행 수 R과 행별 인원 n을 구한다.

- y = 90% − (row − 1) × 76% / (R − 1) → GK 90%, 최전방 14%
- x = col × 100% / (n + 1) → 4백이면 20 / 40 / 60 / 80%
- col 1은 관전자 기준 왼쪽이다. 실제 API 방향이 반대면 함수 안 상수 하나로 뒤집는다.
- `grid`가 없거나 형식이 틀린 선수는 결과에서 뺀다.

### 중계 필터: `selectCommentary(entries, filter)`

- `all`이면 그대로, `united`/`opponent`면 해당 팀 + `neutral`을 남긴다. 순서는 유지한다.

## 상태

| 값 | 위치 (useState / 커스텀 훅 / Context) |
| --- | --- |
| 라인업 팀 전환 (`united` / `opponent`) | `LineupPane` `useState` |
| 명단 탭 (선발 / 후보) | Headless UI `TabGroup` 내부 상태 |
| 중계 필터 (`all` / `united` / `opponent`) | `CommentaryPane` `useState` |
| 경기 데이터 | 지금은 `LivePage`가 목데이터를 props로 전달. SSE 작업에서 [state-management](../../architecture/state-management.md) 판단표로 다시 정한다 |

## 테스트 계획

목데이터와 별개로 테스트 fixture는 `test/fixtures/liveMatch.ts`에 둔다. `types.ts`, `configs.ts`는 테스트하지 않는다.

| 대상 | 검증할 것 |
| --- | --- |
| `toPitchPositions` | 4-3-3 · 4-2-3-1 · 3-5-2 좌표, `null`·잘못된 `grid` 제외, GK만 있는 경우 |
| `selectCommentary` | 필터별 결과, `neutral` 유지, 순서 유지 |
| `LiveScoreboard` | 팀·스코어·시계, 스코어 영역 `aria-live` |
| `PlayerToken` / `PlayerMarks` / `RosterRow` | 마크 종류별 표시, GK·상대 팀 스타일 |
| `LineupPane` | 팀 전환 시 피치·명단·포메이션 변경, 탭 전환과 후보 수 |
| `CommentaryPane` / `CommentaryEvent` / `PeriodNote` | 필터 동작, 좌·우·중립 배치, 골 강조, 종류별 제목 |
| `ClosedView` | 문구, 버튼 링크 |
| `LivePage` | `live`면 보드와 두 패널, `closed`면 `ClosedView` |
| `NavLinkItem` / `Navbar` (기존 테스트 확장) | live dot 노출 조건 |
| `CategoryCardsSection` (기존 테스트 확장) | 라이브 카드 제외 |

## 결정 사항

- 통합형 시안만 구현한다. 라인업과 중계를 한 화면에서 동시에 보여야 SSE 갱신이 한눈에 보인다.
- 상대 라인업은 같은 피치에서 팀 전환 토글로 보여준다. 시안을 가장 적게 바꾸는 방법이다.
- 시안의 포메이션 좌표표 대신 `grid`로 좌표를 계산한다. 실제 API가 `grid`를 주기 때문이다.
- 화면 타입을 DTO와 분리한다. SSE 메시지 형식이 정해지지 않아서 변환 함수만 추가하면 되게 한다.
- 피치는 `onPitch`만 그린다. 교체로 들어온 선수는 나간 선수의 `grid`를 이어받아 같은 자리에 나온다. 이 계산은 SSE 작업 몫이고, 목데이터는 이미 반영된 상태(상대 65' 교체, 맨유 교체 1건)로 만든다.
- 토큰은 선수 `id`로 key를 잡고 `left`/`top`에 `motion-safe:` 트랜지션을 건다. 중계 항목은 `id`로 key를 잡는다. SSE로 값이 바뀌어도 기존 DOM이 유지돼 애니메이션을 붙일 수 있다.
- 시안의 `card`는 경고/퇴장으로 나누고, 메타가 없던 `chance`를 추가한다. 시안에서는 `chance`가 "진행"으로 표시되는 문제가 있었다.
- 피치 잔디 2톤·라인·테두리, GK 노랑, 경고 카드 노랑은 `colors.css`에 토큰으로 추가한다(`pitch`, `pitch-stripe`, `pitch-line`, `pitch-border`, `pitch-gk`, `card-yellow`). 퇴장 카드는 `united-red`를 쓴다.
- 새 페이지이므로 같은 PR에서 `routes.live`를 추가하고 [routing § 페이지 목록](../../architecture/routing.md#페이지-목록)에 행을 추가한다. 새로 쓰는 `href`는 `routes`를 쓴다. 기존 `NAV_ITEMS` 문자열 `href`는 [known-gaps](../../known-gaps.md) #15 범위라 건드리지 않는다.
- 경기 중/비경기 전환은 목데이터의 `status` 값으로 한다.

### 작업 분할

PR이 커지지 않게 3개로 나눈다.

| 순서 | 브랜치 | 내용 |
| --- | --- | --- |
| 1 | `feature/add-live-page-shell` | 이 문서, `routes.live`, routing 문서, 화면 타입·configs·목데이터, `/live`, `LivePage`, `LiveScoreboard`, `ClosedView`, GNB |
| 2 | `feature/add-live-lineup-pane` | 피치 토큰, `toPitchPositions`, 라인업 패널, `LivePage` 연결 |
| 3 | `feature/add-live-commentary-pane` | `selectCommentary`, 중계 패널, `LivePage` 연결 |

- 1번이 `dev`에 머지된 뒤 2번·3번을 `dev`에서 각각 만든다. 2번과 3번은 서로 의존하지 않아 `git worktree`로 동시에 진행할 수 있다.
- 각 PR은 `tsc`, `eslint`, `vitest`, 미러 정합성 검사 통과를 완료 기준으로 한다.

## 미해결

- 관련 이슈 번호
- 임의값(`text-[13px]` 등) 허용 범위는 [style](../../convention/style.md#디자인-토큰)에서 미정이다. 시안 수치는 기존 페이지처럼 임의값으로 옮긴다.
- `grid` col 방향이 실제 API와 같은지는 SSE 작업 때 실데이터로 확인한다.
- 중계 피드가 길어질 때 높이를 제한할지(시안은 제한 없음)는 SSE 연결 후 다시 본다.
