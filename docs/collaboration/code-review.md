# 코드 리뷰

## 도구

- 로컬: Claude Code `code-review` 스킬 (`.claude/skills/code-review/`)
- 외부 리뷰 봇: 미정

## 지적 처리

| 지적 종류 | 처리 |
| --- | --- |
| 버그 | 반영 필수 |
| docs 규칙 위반 (아래 체크리스트) | 반영 필수 |
| 그 외 (개선 제안, 취향) | 선택 |

## 리뷰 체크리스트

| 항목 | 근거 |
| --- | --- |
| FSD 레이어 방향, 같은 레이어 슬라이스 간 import, 서버 전용 모듈의 배럴 노출 | [folder-structure](../architecture/folder-structure.md) |
| `'use client'`가 허용 트리거에 해당하는가, 캐시 수명이 수명표와 맞는가 | [rendering](../architecture/rendering.md) |
| `fetch` 직접 호출, zod 검증 누락, 언랩 누락, 에러 코드 | [data-flow](../architecture/data-flow.md) |
| 상태를 둔 위치가 판단표와 맞는가 | [state-management](../architecture/state-management.md) |
| 경로 문자열 하드코딩 (`routes` 미사용) | [routing](../architecture/routing.md) |
| `process.env` 직접 접근, 백엔드 주소 `NEXT_PUBLIC_` 노출 | [env](../architecture/env.md) |
| `next/image`·`next/font` 미사용 | [performance](../architecture/performance.md) |
| 파일·타입·DTO·변환 함수 이름 | [naming](../convention/naming.md) |
| 무엇을 설명하는 주석, 결정 ID 참조, 주석 처리한 코드 | [comment](../convention/comment.md) |
| `any`, 함수 선언 형태, export 방식 | [typescript](../convention/typescript.md) |
| 인라인 핸들러, `cn` 미사용, Headless UI 미사용, 아이콘 고정 | [ui-component](../convention/ui-component.md) |
| raw hex, `motion-safe:` 누락 | [style](../convention/style.md) |
| 시맨틱 태그, `aria-label`, alt | [accessibility](../convention/accessibility.md) |
| query key 조립, 서버/클라이언트 쿼리 옵션 불일치 | [query](../convention/query.md) |
| 테스트 누락, 미러 위치, 테스트 약화 | [test](../convention/test.md) |
| 커밋 헤더 형식 | [commit](commit.md) |
