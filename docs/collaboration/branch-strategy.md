# 브랜치 전략

Git flow를 기반으로 한다.

## 브랜치

| 브랜치 | 역할 | 분기 기준 | 머지 대상 |
| --- | --- | --- | --- |
| `main` | 운영 배포 (push 시 자동 배포) | — | — |
| `dev` | 통합 (기본 브랜치) | `main` | `release/*` |
| 작업 브랜치 | 기능·수정·디자인 등 일반 작업 | `dev` | `dev` |
| `release/x.y.z` | 릴리스 준비, 마감 수정 | `dev` | `main` |
| `hotfix/*` | 운영 긴급 수정 | `main` | `main` |

- `main`, `dev`에 직접 push하지 않는다. 모든 변경은 PR로 들어간다.
- `release/*`·`hotfix/*`를 `main`에 머지하면, `main`을 `dev`에 다시 머지해 마감 수정을 반영한다.

## 작업 브랜치 이름

형식: `접두사/설명`

| 접두사 | 용도 |
| --- | --- |
| `feature/` | 기능 추가, API 연결 |
| `fix/` | 버그 수정 |
| `design/` | 디자인 시안 반영 |
| `chore/` | 설정, 문서 |

- 설명은 영어 kebab-case로 쓴다.

```
feature/connect-api-in-landing-page
fix/merge-design-updated
design/update-design-news-page
```

## 머지 방식

| PR 방향 | 방식 |
| --- | --- |
| 작업 브랜치 → `dev` | Merge commit |
| `release/*`, `hotfix/*` → `main` | Merge commit (Squash 금지) |
| `main` → `dev` | Merge commit |
