# feature — 페이지별 기록

페이지별 설계·결정 사항을 남긴다. 코드 주석에 쓰던 결정 맥락(왜 이렇게 했는지)도 여기로 옮긴다. → [comment](../convention/comment.md)

## 구조

```
docs/feature/
├── README.md
└── [page]/                      # 페이지 단위: landing, season, players, club, news, highlights
    ├── YYYY-MM-DD-주제.md
    └── YYYY-MM-DD-주제.md
```

- 폴더 이름은 [routing § 페이지 목록](../architecture/routing.md#페이지-목록)의 URL 경로를 따른다. (`/players/[playerId]` → `players/`, `/` → `landing/`)
- 파일명: `YYYY-MM-DD-주제.md` (작성일, 주제는 영어 kebab-case)

## 규칙

1. 기존 날짜 문서는 수정하지 않는다. 바뀐 내용은 새 날짜 문서로 추가한다.
2. 새 문서가 이전 문서를 대체·보완하면 `이전 문서` 항목에 링크한다.
3. 읽을 때는 최신 날짜 문서부터 읽는다. 같은 내용이면 최신 문서가 우선한다.
4. 문서 정리(통합, 삭제)는 사람이 직접 한다.

## 템플릿

```md
# [주제]

- 작성일: YYYY-MM-DD
- 관련 이슈: #
- 이전 문서: 없음 | ./YYYY-MM-DD-xxx.md

## 배경 · 목표

## 화면 · 컴포넌트 구성

| 레이어 | 위치 | 역할 |
| --- | --- | --- |
| b_pages | | |
| c_widgets | | |
| d_features | | |
| e_entities | | |

## 데이터

| 항목 | 내용 |
| --- | --- |
| 백엔드 API | |
| BFF 경로 | |
| schema / DTO | |
| 조회 방식 | prefetch + HydrationBoundary / 'use cache' / 클라이언트 |
| 캐시 수명 | |

## 상태

| 값 | 위치 (useState / 커스텀 훅 / Context) |
| --- | --- |
| | |

## 테스트 계획

| 대상 | 검증할 것 |
| --- | --- |
| | |

## 결정 사항

- 결정 — 이유

## 미해결

-
```
