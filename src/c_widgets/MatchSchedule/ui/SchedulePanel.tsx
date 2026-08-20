// 서버 전용. request-time API(connection()) 호출은 이 파일 한 곳으로 제한한다(S-4).
import { connection } from 'next/server';
import { AlertTriangle } from 'lucide-react';

import { MatchesTab } from '@features/matches/ui';
import { getSchedule } from '@features/matches/api';
import { Shell, StateBox } from '@shared/ui';

const ERROR_ICON = <AlertTriangle size={22} aria-hidden="true" />;

export interface SchedulePanelProps {
  seasonLabel: string;
  seasonStartYear: number;
}

/**
 * SchedulePanel — 데이터 조회 + 실패 분기만 책임진다(S-5). 정상 마크업은 MatchesTab이
 * 그대로 갖는다. connection()으로 세그먼트를 동적화해 schedule이 매 요청 재실행되게
 * 한다(A-4) — 이 파일이 request-time API를 호출하는 유일한 지점이다(S-4).
 * season은 SeasonPage에서 props로 받는다(D-14) — 이 컴포넌트는 season 조회 함수를
 * 직접 호출하지 않는다(S2-10).
 *
 * ⚠️ 아래 `await connection()` 한 줄이 /season을 ƒ(Dynamic)로 유지하는 유일한
 * 장치다. 지우면 셸의 season 조회가 빌드 타임에 구워져 D-10에서 제거한 빌드 타임
 * 백엔드 의존이 되살아난다(R2-6·R3-2). 이 파일을 편집할 때 실수로 지우지 말 것.
 */
export async function SchedulePanel({
  seasonLabel,
  seasonStartYear,
}: SchedulePanelProps) {
  await connection();

  const matches = await getSchedule(seasonStartYear);

  if (matches === null) {
    return (
      <Shell className="pb-16 pt-10">
        <StateBox
          className="min-h-80"
          variant="error"
          icon={ERROR_ICON}
          title="경기 일정을 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      </Shell>
    );
  }

  return <MatchesTab season={seasonLabel} matches={matches} />;
}
