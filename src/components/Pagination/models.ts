export interface PageNumberContainerProps {
  disabled?: boolean;
  children: React.ReactNode;
  className: string;
  onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) &
    ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChangePage: (page: number) => void;
  className?: string;
}
