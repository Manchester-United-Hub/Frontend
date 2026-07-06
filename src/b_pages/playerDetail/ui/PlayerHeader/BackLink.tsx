import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ICON_ARROW_LEFT = <ArrowLeft size={16} aria-hidden="true" />;

/** back-link — 선수 목록으로 이동(고정 경로 `/players`, plan.json ADR-5). */
export function BackLink() {
  return (
    <Link
      href="/players"
      className="inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-muted-foreground transition-colors hover:text-united-red"
    >
      {ICON_ARROW_LEFT}
      선수 목록
    </Link>
  );
}
