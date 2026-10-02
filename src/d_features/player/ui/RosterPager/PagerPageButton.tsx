import { Button } from '@shared/ui';

import { PAGER_BUTTON_CLASSNAME } from './configs';

interface PagerPageButtonProps {
  pageNumber: number;
  isCurrent: boolean;
  onSelect: (page: number) => void;
}

/** 페이지 번호 버튼 — 현재 페이지는 시안 `.pager .on`(united-red 채움)에 대응한다. */
function PagerPageButton({ pageNumber, isCurrent, onSelect }: PagerPageButtonProps) {
  const handleClick = () => onSelect(pageNumber);

  return (
    <Button
      variant={isCurrent ? 'red' : 'outline'}
      className={PAGER_BUTTON_CLASSNAME}
      aria-label={`${pageNumber}페이지`}
      aria-current={isCurrent ? 'page' : undefined}
      onClick={handleClick}
    >
      {pageNumber}
    </Button>
  );
}

export { PagerPageButton, type PagerPageButtonProps };
