import { Badge } from '@shared/ui';
import { cn } from '@shared/utils';
import type { SeasonStatus } from '@entities/seasonInfo/utils';

/**
 * D-6 확정 라벨. 상태가 늘어나면 Record 키 누락으로 컴파일 에러가 나 여기서
 * 라벨을 빠뜨릴 수 없다(S-10).
 */
const SEASON_STATUS_LABEL: Record<SeasonStatus, string> = {
  upcoming: '개막 전',
  ongoing: '시즌 중',
};

export interface SeasonStatusTagProps {
  status: SeasonStatus;
  className?: string;
}

/**
 * SeasonStatusTag — 시즌 진행 상태를 f_shared/ui의 Badge로 표시한다(A-7).
 * 색만으로 상태를 구분하지 않도록 라벨 텍스트를 그대로 DOM에 노출한다.
 * 진행 중은 bg-win 계열(플레이어 헤더의 '현역' 뱃지 선례와 동일한 방식으로
 * className 오버라이드), 개막 전은 Badge의 soft variant를 그대로 쓴다.
 */
export function SeasonStatusTag({ status, className }: SeasonStatusTagProps) {
  const isOngoing = status === 'ongoing';

  return (
    <Badge
      variant={isOngoing ? 'default' : 'soft'}
      className={cn(
        isOngoing && 'border-transparent bg-win/14 text-win',
        className
      )}
    >
      {SEASON_STATUS_LABEL[status]}
    </Badge>
  );
}
