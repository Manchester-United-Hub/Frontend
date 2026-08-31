'use client';

/**
 * SquadPreviewContainer — 스쿼드 프리뷰 데이터 페칭·상태 파생 담당.
 *
 * app/page.tsx가 서버에서 playerServerQueries.list(season)로 prefetch한 캐시를
 * usePlayerList(rosterListQuery(season))가 이어받는다(queryKey를 rosterListQuery 팩토리로
 * 통일해 하이드레이션 캐시를 공유한다). 마크업·상태별 렌더 분기는 SquadPreviewSection이
 * 전담한다 — 이 컴포넌트는 로딩/에러/빈상태/준비 상태만 파생해 내려준다.
 */

import { useMemo } from 'react';

import { rosterListQuery, usePlayerList } from '@features/player/api';

import { selectSquadPreview } from '../../model/selectSquadPreview';
import { SquadPreviewSection, type SquadPreviewStatus } from './SquadPreviewSection';

interface SquadPreviewContainerProps {
  season: number;
}

function SquadPreviewContainer({ season }: SquadPreviewContainerProps) {
  const { data, isLoading, isError, refetch } = usePlayerList(rosterListQuery(season));
  const players = useMemo(() => selectSquadPreview(data), [data]);
  const status: SquadPreviewStatus = isLoading
    ? 'loading'
    : isError
      ? 'error'
      : players.length === 0
        ? 'empty'
        : 'ready';

  const handleRetry = () => {
    refetch();
  };

  return <SquadPreviewSection status={status} players={players} onRetry={handleRetry} />;
}

export { SquadPreviewContainer, type SquadPreviewContainerProps };
