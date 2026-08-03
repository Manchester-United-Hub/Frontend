'use client';
import { cn } from '@shared/utils';
import Image from 'next/image';
import { useState } from 'react';

/**
 * Crest — 팀 코드 원형 배지(30px). 일정(MatchRow)·순위표(StandingsRow) team-cell이
 * 공유하는 시즌 페이지 전용 크레스트다. `@shared/ui` `MatchCard`에 동일한 개념의
 * 로컬 `Crest`가 있지만 export되지 않고(공개 API 아님) 크기도 44px(h-11 w-11)로
 * design-ref의 "crest 30px" 스펙과 달라 그대로 재사용할 수 없다 — season 페이지
 * 전용으로 새로 작성했다(implementation.md §1.5, 신규 작성 사유).
 * 두 탭 폴더(MatchesTab/StandingsTab)가 공유하므로 plan.md 파일 구조상 MatchesTab
 * 하위 나열과 달리 `ui/Crest`로 최상위에 두었다(양쪽에서 import) — result-ST-02.md 결정 기록.
 */

export interface CrestProps {
  /** 3~4자 팀 코드, 예: "MUN". */
  teamLogoUrl: string;
  code: string;
  className?: string;
  utd?: boolean;
}

export function Crest({ teamLogoUrl, code, className, utd }: CrestProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const handleError = () => {
    setHasError(true);
  };
  if (hasError) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'grid h-7.5 w-7.5 flex-none place-items-center rounded-full border text-[11px] font-extrabold',
          utd
            ? 'border-transparent bg-united-red text-white'
            : 'border-border bg-muted text-foreground',
          className
        )}
      >
        {code}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-7.5 w-7.5 flex-none place-items-center rounded-full border-gray-400 text-[11px] font-extrabold content-center object-scale-down',
        className
      )}
    >
      <Image
        className="w-full h-auto"
        alt="팀 로고"
        src={teamLogoUrl}
        width={600}
        height={600}
        loading="lazy"
        onError={handleError}
      />
    </span>
  );
}
