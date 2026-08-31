import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@shared/ui';

import { PAGER_BUTTON_CLASSNAME } from './configs';
import { PagerPageButton } from './PagerPageButton';

/** 페이저 전용 아이콘 (모듈 스코프 호이스팅 — code-conventions §2). */
const ICON_PREV = <ChevronLeft size={16} aria-hidden="true" />;
const ICON_NEXT = <ChevronRight size={16} aria-hidden="true" />;

const FIRST_PAGE = 1;

interface RosterPagerProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buildPageNumbers = (totalPages: number): number[] =>
  Array.from({ length: totalPages }, (_, index) => index + FIRST_PAGE);

/**
 * 결과 페이지네이션 — 시안 `.pager`(이전 · 페이지 번호 · 다음).
 * 페이지가 하나뿐이면 렌더하지 않는다(시안 동작).
 */
function RosterPager({ page, totalPages, onPageChange }: RosterPagerProps) {
  if (totalPages <= FIRST_PAGE) return null;

  const handlePrev = () => onPageChange(page - 1);
  const handleNext = () => onPageChange(page + 1);

  return (
    <nav
      aria-label="선수 목록 페이지"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <Button
        variant="outline"
        className={PAGER_BUTTON_CLASSNAME}
        aria-label="이전 페이지"
        disabled={page === FIRST_PAGE}
        onClick={handlePrev}
      >
        {ICON_PREV}
      </Button>
      {buildPageNumbers(totalPages).map((pageNumber) => (
        <PagerPageButton
          key={pageNumber}
          pageNumber={pageNumber}
          isCurrent={pageNumber === page}
          onSelect={onPageChange}
        />
      ))}
      <Button
        variant="outline"
        className={PAGER_BUTTON_CLASSNAME}
        aria-label="다음 페이지"
        disabled={page === totalPages}
        onClick={handleNext}
      >
        {ICON_NEXT}
      </Button>
    </nav>
  );
}

export { RosterPager, type RosterPagerProps };
