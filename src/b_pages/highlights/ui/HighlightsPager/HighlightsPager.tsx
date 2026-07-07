'use client';

import type { MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@shared/ui';
import { cn } from '@shared/utils';

export interface HighlightsPagerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 페이지네이션 — ChevronLeft · 페이지 숫자 버튼들 · ChevronRight(AD-4: Button/아이콘 조합).
 * 숫자 버튼은 목록이라 인라인 화살표 대신 data-page + 단일 named 핸들러(handlePageButtonClick)로
 * 클릭을 처리한다(인라인 핸들러 금지). 경계에서 이전/다음 비활성화, 현재 페이지에 aria-current.
 */
function HighlightsPager({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: HighlightsPagerProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  function handlePrevClick() {
    if (isFirstPage) return;
    onPageChange(currentPage - 1);
  }

  function handleNextClick() {
    if (isLastPage) return;
    onPageChange(currentPage + 1);
  }

  function handlePageButtonClick(event: MouseEvent<HTMLButtonElement>) {
    const page = Number(event.currentTarget.dataset.page);
    onPageChange(page);
  }

  return (
    <nav
      aria-label="페이지 네비게이션"
      className={cn('flex items-center justify-center gap-1.5', className)}
    >
      <Button
        mode="icon"
        variant="outline"
        aria-label="이전 페이지"
        disabled={isFirstPage}
        onClick={handlePrevClick}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </Button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <Button
            key={page}
            mode="icon"
            variant={isCurrent ? 'red' : 'outline'}
            data-page={page}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={handlePageButtonClick}
          >
            {page}
          </Button>
        );
      })}

      <Button
        mode="icon"
        variant="outline"
        aria-label="다음 페이지"
        disabled={isLastPage}
        onClick={handleNextClick}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </nav>
  );
}

export { HighlightsPager };
