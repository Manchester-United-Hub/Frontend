# Manchester United Hub (manu-hub)

팬이 만든 맨체스터 유나이티드 정보 허브. 시즌·경기·선수·구단·기사·하이라이트를 제공하는 웹앱입니다.

## 기술 스택

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** + class-variance-authority(CVA) + clsx + tailwind-merge(`cn`)
- **Headless UI** (인터랙션) · **lucide-react** (아이콘)
- **TanStack Query** · **Zod**
- **Vitest** + Testing Library

## 아키텍처 — Feature-Sliced Design (FSD)

의존 방향은 **위 → 아래만** 허용합니다.

```
src/
  app/         Next App Router (라우팅 · API route · providers)
  b_pages/     페이지 조합
  c_widgets/   위젯 (Navbar · Footer · News ...)
  d_features/  기능 단위
  e_entities/  도메인 엔티티 (match · news · team · player — model · api)
  f_shared/    공유 — ui(공통 컴포넌트) · api · utils · model
```

경로 별칭: `@app` `@pages` `@widgets` `@features` `@entities` `@shared` `@test`

## 공통 UI 컴포넌트

`@shared/ui` 에서 가져옵니다 — Button · Badge · ResultBadge · Eyebrow · Skeleton · SearchInput · StateBox · MatchCard · PlayerCard · CategoryCard.

- 스타일: Tailwind v4 + CVA, `cn()` 병합(호출자 우선)
- 아이콘: lucide-react 직접 import, 주입 슬롯은 `ReactNode`
- 인터랙션: Headless UI 기반
- 디자인 토큰: `f_shared/ui/tokens` → `app/globals.css`의 `@theme inline`

## 스크립트

| 명령                 | 설명            |
| -------------------- | --------------- |
| `pnpm dev`           | 개발 서버       |
| `pnpm build`         | 프로덕션 빌드   |
| `pnpm start`         | 프로덕션 서버   |
| `pnpm test`          | 테스트 (vitest) |
| `pnpm test:coverage` | 커버리지        |
| `pnpm lint`          | 린트 (ESLint)   |

## 컨벤션

코딩·아키텍처·커밋 컨벤션의 세부 규약은 [`.claude/CLAUDE.md`](.claude/CLAUDE.md)의 "프로젝트: Manchester United Hub" 섹션을 참조하세요.
