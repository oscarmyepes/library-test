export interface PaginationWithRangeInfoProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onChangePage: (page: number) => void;
  className?: string;
}
