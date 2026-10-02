'use client';

/**
 * MatchStripContainer — MatchStripSection에 4상태(status)와 카드 데이터를 배선하는
 * 데이터 컨테이너(ST-006). useLandingMatches()(d_features/matches/api) 하나로 recent·next를
 * 함께 구독하고, MatchStripSection은 순수 표현 컴포넌트로 남는다.
 *
 * recent·next가 둘 다 null인 것만 empty로 본다(개막 전·시즌 종료의 정상 200). 상류 실패
 * (react-query isError)만 error다. 한쪽만 null인 경우는 status='ready'가 되고, 그 카드만
 * undefined로 전달된다 — MatchStripSection은 데이터 유무를 다시 게이트하지 않고 그리드를
 * 그대로 렌더하며, MatchStripGrid가 슬롯 단위로 카드 또는 empty 박스를 분기한다
 * (존재 판정은 이 컨테이너 한 곳에만 있다, High-1 재작업 D-11).
 */

import { useLandingMatches } from '@features/matches/api';

import { toMatchItem } from '../../model/toMatchItem';
import type { MatchStripStatus } from '../../model/types';
import { MatchStripSection } from './MatchStripSection';

const deriveMatchStripStatus = (
  isPending: boolean,
  isError: boolean,
  hasAnyMatch: boolean,
): MatchStripStatus => {
  if (isPending) return 'loading';
  if (isError) return 'error';
  if (!hasAnyMatch) return 'empty';
  return 'ready';
};

export function MatchStripContainer() {
  const { data, isPending, isError } = useLandingMatches();
  const hasAnyMatch = data?.recent != null || data?.next != null;
  const status = deriveMatchStripStatus(isPending, isError, hasAnyMatch);
  const recent = data?.recent ? toMatchItem(data.recent, 'past') : undefined;
  const next = data?.next ? toMatchItem(data.next, 'next') : undefined;

  return <MatchStripSection status={status} recent={recent} next={next} />;
}
