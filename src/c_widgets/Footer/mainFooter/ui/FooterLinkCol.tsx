interface FooterLinkColProps {
  heading: string;
  links: readonly string[];
}

function FooterLinkCol({ heading, links }: FooterLinkColProps) {
  return (
    <div>
      <h3 className="mt-0 mb-[14px] text-[12px] tracking-[0.12em] uppercase text-[#71717a] font-semibold">
        {heading}
      </h3>
      {/* 유효 라우트 미존재 → 비링크(span) 처리 (ADR-7, MatchStrip·Squad와 동일 패턴) */}
      <ul role="list" className="m-0 p-0 list-none">
        {links.map((link) => (
          <li key={link}>
            <span className="block cursor-default text-[14px] text-[#d4d4d8] py-[5px]">
              {link}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { FooterLinkCol, type FooterLinkColProps };
