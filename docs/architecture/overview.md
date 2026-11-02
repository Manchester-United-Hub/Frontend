# 개요

## 서비스

맨체스터 유나이티드 팬을 위한 정보 허브.
시즌(일정·결과·순위), 선수, 구단, 기사, 하이라이트를 제공한다.
로그인/쓰기 기능 없이 공개 데이터를 조회만 한다.

## 시스템 구성

```
[브라우저] → [Next.js 16 (BFF 포함) / Docker on EC2] → [백엔드 API]
```

- 브라우저는 백엔드를 직접 호출하지 않고 Next.js Route Handler(`app/api/v1/*`)를 거친다. → [data-flow](data-flow.md)
- 프론트는 Docker 이미지로 빌드해 EC2에 배포한다. → [ci](../collaboration/ci.md)
- 백엔드는 별도 저장소에서 운영한다.

## 도메인

`e_entities`의 슬라이스가 도메인 단위다.

| 도메인 (슬라이스) | 설명 | 백엔드 API (`API_PATH`) |
| --- | --- | --- |
| `matches` | 경기 일정·결과·라인업 | `GET /api/matches`, `/api/matches/{matchId}`, `/api/matches/{matchId}/detail`, `/api/matches/{matchId}/lineups` |
| `news` | 기사 | `GET /api/news`, `/api/news/recent` |
| `team` | 구단 정보·전적 | `GET /api/teams/{teamId}`, `/api/team/statistics` |
| `player` | 선수 목록·상세·기록 | `GET /api/players`, `/api/players/{playerId}`, `/api/player-details/{playerId}` |
| `rank` | 리그 순위·득점·도움 순위 | `GET /api/rank/premier-league`, `.../topscorers`, `.../topassists` |
| `seasonInfo` | 현재 시즌 | `GET /api/seasons/current` |

- 모든 API는 GET이며 인증이 없다.

## 페이지

[routing § 페이지 목록](routing.md#페이지-목록) 참고.
