import { Eyebrow } from '@shared/ui';

/**
 * PanelHead — 서브탭 패널 공용 헤더(Eyebrow + h2 + 선택 설명).
 * clubInfo `ui/PanelHead`를 그대로 미러링했다(plan.md — 거의 동일 패턴).
 */

export interface PanelHeadProps {
  /** 영문 라벨(예: "Matches & Results"). */
  eyebrow: string;
  /** 국문 타이틀(예: "일정 & 결과"). */
  title: string;
  /** 설명 문단 — 없으면 생략. */
  description?: string;
  /**
   * h2에 부여할 id. 호출부가 aria-labelledby로 참조해야 할 때만 전달한다.
   */
  headingId?: string;
}

export function PanelHead({
  eyebrow,
  title,
  description,
  headingId,
}: PanelHeadProps) {
  return (
    <div className="mb-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={headingId}
        className="mt-1.5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-155 text-[15px] text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
