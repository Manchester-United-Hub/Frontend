/**
 * 포지션 필터 옵션 — production 상수. `FilterBarSection`의 `positionOptions`로 주입된다.
 * DECADES/SQUADS(활약연도·스쿼드)는 실 데이터에 대응 필드가 없어 삭제됐다(리뷰 H-3 —
 * `FilterBarSection`이 옵션 미지정 시 해당 셀렉트를 렌더하지 않는다). POSITIONS만
 * `PlayerDTO.position`(mapApiPositionToCode를 거친 GK/DF/MF/FW)과 대응해 살아남는다.
 */

import { ALL_FILTER_KEY } from './types';
import type { FilterOption } from './types';

export const POSITIONS: FilterOption[] = [
  { key: ALL_FILTER_KEY, label: '전체' },
  { key: 'GK', label: '골키퍼 · GK' },
  { key: 'DF', label: '수비수 · DF' },
  { key: 'MF', label: '미드필더 · MF' },
  { key: 'FW', label: '공격수 · FW' },
];
