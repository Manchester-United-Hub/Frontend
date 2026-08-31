/**
 * 페이지 봉투(.players)를 언랩하고 도메인 뷰모델로 변환해 상위 SQUAD_PREVIEW_COUNT명만 남긴다.
 *
 * 인자는 usePlayerList가 이미 BffApiResponse를 언랩한 값(PlyaerListDTO)이다 — 재언랩 금지.
 * 정렬은 등번호 오름차순(미배정은 후순위, 동률은 이름순)이다: API 기본 정렬(이름 알파벳순) 그대로
 * 상위 N을 자르면 A로 시작하는 선수만 남기 때문에, 스쿼드 표기 관례이자 결정적인(테스트 가능한)
 * 등번호순으로 다시 정렬한다.
 */

import { mapPlayerDtoToListItem } from '@entities/player/utils';
import type { PlayerListItem, PlyaerListDTO } from '@entities/player/model';

/** 데스크탑 4열 2행 프리뷰 건수. */
const SQUAD_PREVIEW_COUNT = 8;

const comparePlayersByNumber = (a: PlayerListItem, b: PlayerListItem): number => {
  if (a.number === undefined) return b.number === undefined ? a.name.localeCompare(b.name) : 1;
  if (b.number === undefined) return -1;
  return a.number - b.number || a.name.localeCompare(b.name);
};

const selectSquadPreview = (data: PlyaerListDTO | undefined): PlayerListItem[] => {
  if (data === undefined) return [];

  return data.players
    .map(mapPlayerDtoToListItem)
    .toSorted(comparePlayersByNumber)
    .slice(0, SQUAD_PREVIEW_COUNT);
};

export { selectSquadPreview, SQUAD_PREVIEW_COUNT };
