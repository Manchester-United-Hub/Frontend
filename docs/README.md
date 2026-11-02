# docs

필요한 문서만 골라 읽는다. 각 문서는 한 주제만 다루고, 다른 주제는 링크로 넘긴다.

## architecture/ — 구조와 기술 결정

| 문서 | 내용 |
| --- | --- |
| [overview](architecture/overview.md) | 서비스 소개, 시스템 구성, 도메인 |
| [tech-stack](architecture/tech-stack.md) | 사용 기술과 도입 상태 |
| [folder-structure](architecture/folder-structure.md) | FSD 레이어·세그먼트, 경로 별칭, 배럴, 테스트 위치 |
| [rendering](architecture/rendering.md) | Server/Client 경계, ISR·`'use cache'`, 로딩·에러 |
| [data-flow](architecture/data-flow.md) | 백엔드 → BFF → 클라이언트, 응답 래퍼, 검증·변환, 에러 처리 |
| [state-management](architecture/state-management.md) | 상태를 어디에 둘지 판단표 |
| [routing](architecture/routing.md) | 페이지 목록, `routes`, 내비게이션 메뉴 |
| [seo-metadata](architecture/seo-metadata.md) | title, description, OG·sitemap(미정) |
| [env](architecture/env.md) | 환경변수 키, 서버/브라우저 호출 경로 |
| [performance](architecture/performance.md) | 이미지·폰트, 서버 프리페치, 번들 분리 |

## convention/ — 코드 작성 규칙

| 문서 | 내용 |
| --- | --- |
| [naming](convention/naming.md) | 파일·폴더·상수·타입·DTO 이름, import |
| [comment](convention/comment.md) | 불필요한 주석 금지, 남겨도 되는 주석 |
| [typescript](convention/typescript.md) | `any` 금지, type/interface, 함수 선언 형태 |
| [ui-component](convention/ui-component.md) | `f_shared/ui` 구조, CVA·`cn`, Headless UI, lucide, 아이콘 슬롯 |
| [style](convention/style.md) | Tailwind v4, 디자인 토큰, 모션 |
| [accessibility](convention/accessibility.md) | 시맨틱 태그, ARIA, 키보드, 동작 줄이기 |
| [query](convention/query.md) | TanStack Query 키·옵션 팩토리, 서버/클라이언트 쿼리 분리 |
| [test](convention/test.md) | Vitest·Testing Library, `test/` 미러 규칙, 커버리지 |

## collaboration/ — 협업 프로세스

| 문서 | 내용 |
| --- | --- |
| [branch-strategy](collaboration/branch-strategy.md) | `main`·`dev`·`release/*`, 작업 브랜치 이름 |
| [commit](collaboration/commit.md) | 커밋 헤더·타입 (상세는 commit-message-generator 스킬) |
| [pr-flow](collaboration/pr-flow.md) | 기본 플로우, PR·이슈 템플릿, 릴리스 |
| [code-review](collaboration/code-review.md) | 리뷰 체크리스트, 지적 처리 |
| [ci](collaboration/ci.md) | Husky, GitHub Actions CI, Docker → EC2 배포 |

## feature/ — 페이지별 기록

| 문서 | 내용 |
| --- | --- |
| [feature/README](feature/README.md) | 폴더·파일명 규칙, 읽는 순서, 설계 문서 템플릿 |

## 규칙과 다른 기존 코드

| 문서 | 내용 |
| --- | --- |
| [known-gaps](known-gaps.md) | 규칙을 정한 시점에 규칙과 맞지 않는 기존 코드와 정리 방향 |

## 문서 운영 규칙

1. 문서는 한국어로 쓴다.
2. 문서 하나는 300줄 이내로 쓴다. 넘으면 하위 문서로 나누고 상위 문서에서 링크한다.
3. 여러 문서에 반복되는 내용은 한 문서에만 정의하고, 나머지는 링크한다.
4. 합의되지 않은 규칙은 문서에 쓰지 않는다. 미정인 항목은 "미정"으로 표시한다.
5. 새 문서를 추가하면 이 파일의 표에 등록한다.
6. `feature/` 문서 규칙은 [feature/README](feature/README.md#규칙)를 따른다.
7. 규칙을 새로 정했는데 기존 코드가 맞지 않으면 [known-gaps](known-gaps.md)에 추가한다.
