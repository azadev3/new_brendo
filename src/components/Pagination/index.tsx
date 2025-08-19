
import type * as React from 'react';
import { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface PaginationItemProps {
  number: number;
  isActive?: boolean;
  onClick?: () => void;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  number,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] text-black rounded-full ${
        isActive
          ? 'text-black bg-[#B1C7E4]'
          : 'border border-black border-opacity-15 text-opacity-55'
      }`}
      aria-current={isActive ? 'page' : undefined}>
      {number}
    </button>
  );
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3; // Adjust this number to control how many pages are shown

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage + 1; i <= endPage; i++) {
      // if (i === endPage) {
      //     return;
      // }
      pages.push(
        <PaginationItem
          key={i}
          number={i}
          isActive={currentPage === i}
          onClick={() => onPageChange(i)}
        />
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <div
          key="start-ellipsis"
          className="flex w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] rounded-full border border-black opacity-15 justify-center items-center">
          ...
        </div>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <div
          key="end-ellipsis"
          className="flex w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] rounded-full border border-black opacity-15 justify-center items-center">
          ...
        </div>
      );
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination navigation" className="mb-[60px] sm:mb-[120px]">
      <div className="flex gap-2 sm:gap-4 justify-center items-center mt-10 sm:mt-20 text-sm sm:text-base font-medium tracking-wide text-center text-blue-800 whitespace-nowrap">
        <button
          className={cn(
            'flex h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-blue-800/30 justify-center items-center transition-colors',
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-50'
          )}
          onClick={handlePrevious}
          aria-label="Previous page"
          disabled={currentPage === 1}>
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex gap-1 sm:gap-2 items-end self-stretch my-auto">
          <PaginationItem
            key={1}
            number={1}
            isActive={currentPage === 1}
            onClick={() => onPageChange(1)}
          />
          {renderPageNumbers()}
          <PaginationItem
            key={totalPages}
            number={totalPages}
            isActive={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        </div>
        <button
          className={cn(
            'flex h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-blue-800/30 justify-center items-center transition-colors',
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-50'
          )}
          onClick={handleNext}
          aria-label="Next page"
          disabled={currentPage === totalPages}>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </nav>
  );
};
