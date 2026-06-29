import { InputHTMLAttributes } from 'react';

import { cn } from '@shared/utils';

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional keyboard-shortcut hint rendered as a <kbd>, e.g. "/". */
  shortcut?: string;
  /** Class applied to the outer label wrapper. */
  containerClassName?: string;
}

const SearchGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const SearchInput = ({
  shortcut,
  containerClassName,
  className,
  'aria-label': ariaLabel = '검색',
  ...rest
}: SearchInputProps) => {
  return (
    <label
      className={cn(
        'flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-muted-foreground transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
        containerClassName,
      )}
    >
      <SearchGlyph />
      <input
        type="search"
        aria-label={ariaLabel}
        className={cn(
          'min-w-0 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
          className,
        )}
        {...rest}
      />
      {shortcut ? (
        <kbd className="rounded border border-border bg-muted px-[5px] py-px font-mono text-[11px] text-muted-foreground">
          {shortcut}
        </kbd>
      ) : null}
    </label>
  );
};

export { SearchInput, type SearchInputProps };
