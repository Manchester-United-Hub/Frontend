import { Eyebrow } from '@shared/ui';

/**
 * PanelHead — 서브탭 패널 공용 헤더(Eyebrow + h2 + 선택 설명). History·Squad·Manager·
 * Stadium 4개 탭이 각자 중복 구현하던 panel-head 마크업(design-ref club.css
 * `.panel-head`)을 단일 컴포넌트로 추출했다(§code-quality 4기준 — 응집도).
 * 클래스는 원래 탭들이 쓰던 값을 그대로 이관해 시각 결과가 동일하다.
 */

export interface PanelHeadProps {
  /** 영문 라벨(예: "Club History"). */
  eyebrow: string;
  /** 국문 타이틀(예: "연혁"). */
  title: string;
  /** 설명 문단 — 없는 탭(감독·홈구장)은 생략. */
  description?: string;
  /**
   * h2에 부여할 id. 호출부가 aria-labelledby로 참조해야 할 때만 전달한다
   * (예: HistoryTab의 <ol aria-labelledby>, StadiumTab의 <section aria-labelledby>).
   */
  headingId?: string;
}

export function PanelHead({ eyebrow, title, description, headingId }: PanelHeadProps) {
  return (
    <div className="mb-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={headingId} className="mt-1.5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-[620px] text-[15px] text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
