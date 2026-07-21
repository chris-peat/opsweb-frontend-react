import { Fragment, useMemo, type ReactNode } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/react/20/solid';

const DOTS = 'DOTS' as const;
type PageItem = number | typeof DOTS;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}                                                                                                                                                                                                                                               

interface UsePaginationRangeArgs {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
}

/**
 * Computes the list of page numbers (with DOTS placeholders) to render,
 * so we never show every page for large datasets.
 */
function usePaginationRange({
  totalPages,
  currentPage,
  siblingCount = 1,
}: UsePaginationRangeArgs): PageItem[] {
  return useMemo(() => {
    // pages to show: first, last, current, siblings on each side, plus 2 dots
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + siblingCount * 2;
      return [...range(1, leftItemCount), DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + siblingCount * 2;
      return [1, DOTS, ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPages];
  }, [totalPages, currentPage, siblingCount]);
}

export interface PaginationProps {
  /** Current active page (1-indexed). */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called with the new page number when the user navigates. */
  onPageChange: (page: number) => void;
  /** How many page numbers to show on each side of the current page. */
  siblingCount?: number;
  /** Total record count, used to render the "Showing X–Y of Z" text. Omit to hide it. */
  totalItems?: number;
  /** Number of records per page. Required if totalItems or onPageSizeChange is set. */
  pageSize?: number;
  /** Options for the "rows per page" selector. */
  pageSizeOptions?: number[];
  /** Called with the new page size when the user changes it. Omit to hide the selector. */
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
}: PaginationProps) {
  const pages = usePaginationRange({ totalPages, currentPage, siblingCount });

  if (totalPages <= 0) return null;

  const goTo = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    if (clamped !== currentPage) onPageChange(clamped);
  };

  const rangeStart = totalItems != null && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const rangeEnd =
    totalItems != null && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Result count + page size selector */}
      <div className="flex items-center gap-4 text-sm text-slate-500">
        {totalItems != null && (
          <p className="tabular-nums">
            Showing <span className="font-medium text-slate-900">{rangeStart}</span>–
            <span className="font-medium text-slate-900">{rangeEnd}</span> of{' '}
            <span className="font-medium text-slate-900">{totalItems}</span>
          </p>
        )}

        {onPageSizeChange && (
          <Listbox value={pageSize} onChange={onPageSizeChange}>
            <div className="relative">
              <Listbox.Button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1">
                {pageSize} / page
                <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute top-full z-10 mt-1 max-h-56 w-32 overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg focus:outline-none">
                  {pageSizeOptions.map((size) => (
                    <Listbox.Option
                      key={size}
                      value={size}
                      className={({ active }: { active: boolean }) =>
                        `flex cursor-pointer items-center justify-between px-3 py-1.5 ${
                          active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                        }`
                      }
                    >
                      {({ selected }: { selected: boolean }) => (
                        <>
                          {size} / page
                          {selected && <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        )}
      </div>

      {/* Page controls */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <NavButton onClick={() => goTo(1)} disabled={currentPage === 1} label="First page">
          <ChevronDoubleLeftIcon className="h-4 w-4" aria-hidden="true" />
        </NavButton>
        <NavButton
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </NavButton>

        <ul className="flex items-center gap-1">
          {pages.map((page, i) =>
            page === DOTS ? (
              <li key={`dots-${i}`} className="px-2 text-sm text-slate-400 select-none">
                &#8230;
              </li>
            ) : (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => goTo(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                    page === currentPage
                      ? 'bg-blue-600 font-medium text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              </li>
            )
          )}
        </ul>

        <NavButton
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </NavButton>
        <NavButton
          onClick={() => goTo(totalPages)}
          disabled={currentPage === totalPages}
          label="Last page"
        >
          <ChevronDoubleRightIcon className="h-4 w-4" aria-hidden="true" />
        </NavButton>
      </nav>
    </div>
  );
}

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: ReactNode;
}

function NavButton({ onClick, disabled, label, children }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
