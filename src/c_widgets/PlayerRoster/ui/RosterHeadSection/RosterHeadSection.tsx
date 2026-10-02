import { Eyebrow, Shell } from '@shared/ui';

/**
 * 선수 목록 페이지 헤더 — players.css `.roster-head` 스펙을 Tailwind 토큰 유틸로 재현.
 * 이 페이지 전용 정적 문구(다른 곳에서 재사용되지 않음)라 props 없이 자체 완결형으로 둔다.
 * 디자인 소스가 별도 `.mu-shell`로 감싼 헤더이므로 이 섹션이 Shell을 직접 소유한다
 * (FilterBarSection·ResultRow는 PlayerListPage가 공유하는 별도 Shell 안에서 조립된다).
 */
function RosterHeadSection() {
  return (
    <Shell className="pt-10 pb-2">
      <Eyebrow>First Team & Legends</Eyebrow>
      <h1 className="mt-1.5 text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em]">
        역대 선수 목록
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        현역 1군부터 클럽의 레전드까지 — 포지션·연도·스쿼드로 좁혀 찾아보세요.
      </p>
    </Shell>
  );
}

export { RosterHeadSection };
