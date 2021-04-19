import { Orientation } from '../../models/generic';
import { Product, VisibleField } from '../../models/search';

export interface ProductListItemProps {
  data: Product;
  styled?: boolean;
  visibleFields?: VisibleField<Product>[];
  className?: string;
  orientation?: Orientation;
  noImageUrl?: string;
}
