'use client';

/**
 * FeaturedMatchContainer — HeroSection의 matchPanel 슬롯에 주입되는 데이터 컨테이너(ST-006).
 *
 * useLandingMatches()(d_features/matches/api) 구독 결과를 4상태로 분기한다. 상태 판정은 이
 * 파일에 집중되어 있고, FeaturedMatchPanel·FeaturedMatchPanelSkeleton은 데이터를 모르는 순수
 * 표현 컴포넌트로 남는다(RosterPanel/RosterContent 경계와 동일한 패턴).
 *
 * next===null(개막 전·시즌 종료로 다음 경기가 없는 정상 200)은 에러가 아니라 empty다 —
 * StateBox variant="error"는 상류 실패(BFF 502 → react-query isError)에만 쓴다.
 * NEXT_MATCH_EMPTY_BOX·ERROR_BOX는 landing/ui/matchStates.tsx의 상수를 그대로 재사용하되,
 * Hero는 항상 다크 배경이라 HeroStateBox로 감싸 시각만 교정한다(R-4, M4+L7, D-11).
 */

import { useLandingMatches } from '@features/matches/api';

import { toMatchItem } from '../../model/toMatchItem';
import { ERROR_BOX, NEXT_MATCH_EMPTY_BOX } from '../matchStates';
import { FeaturedMatchPanel } from './FeaturedMatchPanel';
import { FeaturedMatchPanelSkeleton } from './FeaturedMatchPanelSkeleton';
import { HeroStateBox } from './HeroStateBox';

export function FeaturedMatchContainer() {
  const query = useLandingMatches();

  if (query.isPending) return <FeaturedMatchPanelSkeleton />;
  if (query.isError) return <HeroStateBox box={ERROR_BOX} />;
  if (query.data.next == null) return <HeroStateBox box={NEXT_MATCH_EMPTY_BOX} />;

  return <FeaturedMatchPanel match={toMatchItem(query.data.next, 'next')} />;
}
