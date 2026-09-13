const DAY_MS = 86_400_000;

/**
 * kickoff까지 남은 일수를 'D-n' 형태로 계산한다. `now`를 주입받아 순수 함수로 유지한다
 * (테스트 가능성, High-2 재작업 R-2). `convertMatchesDTO2DAO.ts`의 `calculateDaysUntil`과
 * 같은 공식(DAY_MS·Math.ceil·Math.max(0, …))을 쓴다 — 두 공식이 갈라지면 표시값이
 * 계층마다 달라진다(알려진 부채, decision-1.md).
 */
const buildCountdownLabel = (kickoff: string, now: Date): string => {
  const kickoffMs = new Date(kickoff).getTime();
  const days = Math.max(0, Math.ceil((kickoffMs - now.getTime()) / DAY_MS));
  return `D-${days}`;
};

export { buildCountdownLabel };
