import type { Route } from 'next';

interface NavItem {
  id: string;
  label: string;
  labelEn: string;
  href?: Route;
}

export type { NavItem };
