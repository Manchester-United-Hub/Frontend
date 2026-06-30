import { Badge, MatchCard } from '@shared/ui';
import type { MatchItem } from '../../model/types';

interface MatchStripGridProps {
  recent: MatchItem;
  next: MatchItem;
}

/** ready 상태의 최근·다음 경기 카드 그리드 (props 의존) */
function MatchStripGrid({ recent, next }: MatchStripGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
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
    </div>
  );
}

export { MatchStripGrid, type MatchStripGridProps };
