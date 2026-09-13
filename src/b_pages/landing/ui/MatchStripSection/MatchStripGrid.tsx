import { Badge, MatchCard } from '@shared/ui';
import type { MatchItem } from '../../model/types';
import { NEXT_MATCH_EMPTY_BOX, RECENT_MATCH_EMPTY_BOX } from '../matchStates';

interface MatchStripGridProps {
  /** 없으면 RECENT_MATCH_EMPTY_BOX를 슬롯에 렌더한다(High-1 재작업, D-11). */
  recent?: MatchItem;
  /** 없으면 NEXT_MATCH_EMPTY_BOX를 슬롯에 렌더한다(High-1 재작업, D-11). */
  next?: MatchItem;
}

/**
 * ready 상태의 최근·다음 경기 슬롯 2칸. 각 슬롯은 데이터가 있으면 MatchCard, 없으면
 * 해당 슬롯의 empty 박스를 렌더한다 — 존재 판정 게이트는 컨테이너(recent‖next) 한 곳에만
 * 있고 여기서는 슬롯 단위로만 분기한다(High-1 재작업, D-11).
 */
function MatchStripGrid({ recent, next }: MatchStripGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
      {recent != null ? (
        <MatchCard
          variant="past"
          tag={recent.tag}
          competition={recent.competition}
          home={recent.home}
          away={recent.away}
          result={recent.result}
          venue={recent.venue}
          date={recent.date}
        />
      ) : (
        RECENT_MATCH_EMPTY_BOX
      )}
      {next != null ? (
        <MatchCard
          variant="next"
          tag={next.tag}
          competition={next.competition}
          home={next.home}
          away={next.away}
          venue={next.venue}
          date={next.time != null ? `${next.date} ${next.time}` : next.date}
          action={
            next.countdown != null ? (
              <Badge variant="soft">{next.countdown}</Badge>
            ) : undefined
          }
        />
      ) : (
        NEXT_MATCH_EMPTY_BOX
      )}
    </div>
  );
}

export { MatchStripGrid, type MatchStripGridProps };
