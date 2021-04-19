import { ProductListProps, SortOption } from '../ProductList/models';

export interface ListControlsProps
  extends Pick<ProductListProps, 'orientation'> {
  onLayoutChange: (orientation: ProductListProps['orientation']) => void;
  onItemsPerPageChange: (value: number) => void;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  styled?: boolean;
  className?: string;
  sortOptions?: SortOption[];
  selectedSort?: number | string;
  onSortChange?: (id: number | string) => void;
}
