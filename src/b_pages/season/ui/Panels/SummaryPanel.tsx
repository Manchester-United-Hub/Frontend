// 서버 전용. connection() 등 request-time API 호출 금지 — SchedulePanel 전용이다(S-4).
import { getStandings } from '@features/rank/api';

import { toSeasonSummaryCards } from '../../model';
import { SummaryCards } from '../SummaryCards';

export interface SummaryPanelProps {
  seasonStartYear: number;
}

/**
 * SummaryPanel — 실패 시에도 StateBox 분기를 두지 않는다(S-5의 "패널은 조회+실패분기"와
 * 어긋나 보이는 지점). 요약 카드는 페이지 최상단 레이아웃을 차지해 에러 박스로 치환하면
 * 화면이 크게 흔들린다. 그리고 이 패널과 StandingsPanel은 같은 getStandings 결과를
 * 받으므로(React cache() dedup — ST2-03 DoD 8b 실측) 실패는 항상 두 곳에 동시에
 * 온다 — 같은 실패를 같은 크기로 두 번 알릴 필요가 없다. 상단은 조용한 플레이스홀더로
 * 자리를 지키고 상세 에러는 순위표 탭이 낸다(B-5).
 */
export async function SummaryPanel({ seasonStartYear }: SummaryPanelProps) {
  const standings = await getStandings(seasonStartYear);

  return <SummaryCards summaryCards={toSeasonSummaryCards(standings)} />;
}
