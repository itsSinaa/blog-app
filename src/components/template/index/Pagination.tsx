import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

type PostPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PostPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PostPaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          onClick={(e) => {
            if (currentPage === 1) {
              e.preventDefault();
            } else {
              onPageChange(currentPage - 1);
            }
          }}>
          <PaginationPrevious />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(Number(page))}
              className="cursor-pointer"

              isActive={currentPage === page}
              aria-current={currentPage === page ? "page" : undefined}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem
          className={
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }
          onClick={(e) => {
            if (currentPage === totalPages) {
              e.preventDefault();
            } else {
              onPageChange(currentPage + 1);
            }
          }}>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PostPagination;
