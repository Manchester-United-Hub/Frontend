'use client';

/**
 * SquadPreviewContainer — 스쿼드 프리뷰의 껍데기(section·헤더)와 경계(에러·서스펜스) 소유.
 *
 * 헤더·여백을 Suspense 바깥에 두어 로딩 중에도 섹션이 통째로 사라지지 않게 한다.
 * 데이터 조회는 SquadPreviewSection이 useSuspenseQuery로 수행하므로, 로딩은 Suspense
 * fallback이, 에러는 ErrorBoundary fallback이 받는다 — useSuspenseQuery는 에러를
 * isError가 아니라 throw로 알리기 때문이다.
 *
 * 재시도는 useQueryErrorResetBoundary().reset으로 실패 쿼리의 리셋을 예약한 뒤 경계를
 * 되돌린다. 그래야 children이 다시 렌더될 때 react-query가 재조회한다.
 */

import { Suspense } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

import { RosterErrorState } from '@features/player/ui';
import { ErrorBoundary } from '@shared/ui';

import { SQUAD_PREVIEW_COUNT } from '../../model/selectSquadPreview';
import { PlayerCardSkeleton } from './PlayerCardSkeleton';
import { SECTION_HEADING_ID, SquadPreviewHeader } from './SquadPreviewHeader';
import { SquadPreviewSection } from './SquadPreviewSection';

interface SquadPreviewContainerProps {
  season: number;
}

const LOADING_GRID = (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: SQUAD_PREVIEW_COUNT }, (_, index) => (
      <PlayerCardSkeleton key={index} />
    ))}
  </div>
);

const renderRosterError = (retry: () => void) => (
  <RosterErrorState onRetry={retry} />
);

function SquadPreviewContainer({ season }: SquadPreviewContainerProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <section
      aria-labelledby={SECTION_HEADING_ID}
      className="py-14 max-[620px]:py-11"
    >
      <div className="mx-auto max-w-shell px-6">
        <SquadPreviewHeader />
        <ErrorBoundary onReset={reset} fallback={renderRosterError}>
          <Suspense fallback={LOADING_GRID}>
            <SquadPreviewSection season={season} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}

export { SquadPreviewContainer, type SquadPreviewContainerProps };
