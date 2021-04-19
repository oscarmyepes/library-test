import { Product, ListResponse } from '../../models/search';
import { ProductListProps } from '../ProductList/models';

export interface ProductListWrapperProps
  extends Omit<ProductListProps, 'list' | 'totalPages' | 'isLoading'> {
  search: string;
  className?: string;
  onDataReceived?: (data: ListResponse<Product>) => void;
  query?: { [key: string]: string | null };
}
