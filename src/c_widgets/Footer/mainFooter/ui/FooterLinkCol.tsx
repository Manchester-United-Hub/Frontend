import Link from 'next/link';
import type { FooterLink } from '../model';

interface FooterLinkColProps {
  heading: string;
  links: readonly FooterLink[];
}

function FooterLinkCol({ heading, links }: FooterLinkColProps) {
  return (
    <div>
      <h3 className="mt-0 mb-[14px] text-[12px] tracking-[0.12em] uppercase text-[#71717a] font-semibold">
        {heading}
      </h3>
      <ul role="list" className="m-0 p-0 list-none">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-sm text-[14px] text-[#d4d4d8] py-[5px] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { FooterLinkCol, type FooterLinkColProps };
