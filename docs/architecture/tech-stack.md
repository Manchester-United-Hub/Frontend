# 기술 스택

`설치됨`: 저장소 설정·`package.json`에 반영됨 · `미사용`: 설치됐지만 쓰는 코드가 없음

## 런타임 / 프레임워크

| 영역 | 기술 | 상태 |
| --- | --- | --- |
| 런타임 | Node.js 24 | 설치됨 (CI·`Dockerfile`) |
| 패키지 매니저 | pnpm 11 | 설치됨 (`packageManager`) |
| 프레임워크 | Next.js 16 (App Router) | 설치됨 |
| UI 런타임 | React 19 | 설치됨 |
| 언어 | TypeScript (strict, `any` 금지) | 설치됨 |
| 스타일 | Tailwind CSS v4 | 설치됨 |

## UI / 데이터

| 영역 | 기술 | 상태 | 비고 |
| --- | --- | --- | --- |
| 인터랙션 UI | @headlessui/react | 설치됨 | 드롭다운·탭·모달 등 동작이 있는 UI → [ui-component](../convention/ui-component.md) |
| 아이콘 | lucide-react | 설치됨 | 컴포넌트에서 직접 import |
| variant | class-variance-authority (CVA) | 설치됨 | |
| 클래스 병합 | clsx + tailwind-merge (`cn`) | 설치됨 | `f_shared/utils/cn.ts` |
| 서버 상태 | TanStack Query v5 | 설치됨 | → [query](../convention/query.md) |
| API 검증 | zod v4 | 설치됨 | → [data-flow](data-flow.md) |
| 폰트 | Pretendard Variable (`next/font/local`) | 설치됨 | `public/fonts/` |

## 품질 / 테스트

| 영역 | 기술 | 상태 | 비고 |
| --- | --- | --- | --- |
| Lint | ESLint 9 (`eslint-config-next`) | 설치됨 | |
| Format | Prettier | 설치됨 (`.prettierrc`) | |
| Git hook | Husky | 설치됨 | → [ci § 로컬](../collaboration/ci.md#로컬-husky) |
| 단위/컴포넌트 테스트 | Vitest + Testing Library + jsdom | 설치됨 | → [test](../convention/test.md) |
| 커버리지 | `@vitest/coverage-v8` | 설치됨 | |
| E2E 테스트 | Playwright | 미사용 | 도입 여부 미정 |

## CI/CD · 배포

| 영역 | 기술 | 상태 |
| --- | --- | --- |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | 설치됨 |
| CD | GitHub Actions → Docker Hub → EC2 (`.github/workflows/deploy.yml`) | 설치됨 |
| 컨테이너 | Docker (`output: 'standalone'`) | 설치됨 |
| Netlify | `netlify.toml` | 사용 여부 미정 |
| 분석·모니터링 | — | 미정 |
