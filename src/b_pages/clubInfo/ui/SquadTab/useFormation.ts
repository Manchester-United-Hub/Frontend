'use client';

import { useCallback, useState } from 'react';

import { FORMATIONS } from '../../model/formations';
import type { FormationCoordinate, FormationName } from '../../model/types';

const DEFAULT_FORMATION: FormationName = '4-3-3';

interface UseFormationResult {
  formation: FormationName;
  setFormation: (next: FormationName) => void;
  /** 선택 포메이션의 토큰 좌표 11개 — 렌더 중 파생 계산(FORMATIONS[formation]), effect 동기화 없음. */
  tokens: FormationCoordinate[];
}

/**
 * 선택 포메이션 상태와 그에 대응하는 피치 토큰 좌표를 제공하는 훅.
 * `tokens`는 `formation` state로부터 렌더 중 직접 계산한다(code-conventions §1) —
 * 포메이션 전환은 좌표 데이터 교체일 뿐, 별도 state/effect로 동기화하지 않는다.
 */
function useFormation(): UseFormationResult {
  const [formation, setFormationState] = useState<FormationName>(DEFAULT_FORMATION);

  const setFormation = useCallback((next: FormationName) => {
    setFormationState(() => next);
  }, []);

  const tokens = FORMATIONS[formation];

  return { formation, setFormation, tokens };
}

export { useFormation, type UseFormationResult };
