import type { Route } from 'next';

interface FooterLink {
  label: string;
  href: Route;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export type { FooterLink, FooterColumn };
