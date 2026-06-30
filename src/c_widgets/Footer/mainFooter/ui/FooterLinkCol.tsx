interface FooterLinkColProps {
  heading: string;
  links: readonly string[];
}

function FooterLinkCol({ heading, links }: FooterLinkColProps) {
  return (
    <div>
      <h5 className="mt-0 mb-[14px] text-[12px] tracking-[0.12em] uppercase text-[#71717a] font-semibold">
        {heading}
      </h5>
      <ul role="list" className="m-0 p-0 list-none">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="block text-[14px] text-[#d4d4d8] py-[5px] transition-colors duration-150 hover:text-[var(--united-red)] focus-visible:outline-none focus-visible:text-[var(--united-red)]"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { FooterLinkCol, type FooterLinkColProps };
