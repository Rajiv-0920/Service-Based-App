import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useFilters } from '@/hooks/useFilters';
import { cn } from '@/lib/utils';

export function PaginationBar({ page, totalPages }) {
  const { setFilters } = useFilters();

  function getPages() {
    const pages = new Set([1, totalPages, page, page - 1, page + 1]);
    return [...pages]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  }

  const pages = getPages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setFilters({ page: Math.max(1, page - 1) })}
            className={cn(
              'cursor-pointer',
              page === 1 && 'pointer-events-none opacity-40',
            )}
          />
        </PaginationItem>

        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          return (
            <React.Fragment key={p}>
              {prev && p - prev > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer"
                  isActive={p === page}
                  onClick={() => setFilters({ page: p })}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => setFilters({ page: Math.min(totalPages, page + 1) })}
            className={cn(
              'cursor-pointer',
              page === totalPages && 'pointer-events-none opacity-40',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
