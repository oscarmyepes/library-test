import { ListProps } from '../../common/List/List';
import { Product, VisibleField } from '../../models/search';

export interface ProductListProps extends Omit<ListProps<Product>, 'children'> {
  /**
   * The list to be rendered.
   */
  list: Product[];
  /**
   * Callback function to render custom list items.
   */
  renderList?: (data: Product[]) => JSX.Element;
  /**
   * Whether you prefer to render each item in an anchor tag, React route Link or any other link component.
   */
  linkEl?: React.ElementType;
  /**
   * The list of fields you want to show for the product.
   *
   * Example:
   * ```
   [
      { prop: 'title' },
      { label: 'BRAND: ', prop: 'brand_name' },
      { prop: 'price' },
    ];
   * ```
   */
  visibleFields?: VisibleField<Product>[];
  /**
   * Image url to show when there is no image for the product.
   *
   * If there is no image for the product and `noImageUrl` is passed, we render a placeholder.
   */
  noImageUrl?: string;
}

export interface SortOption {
  id: number | string;
  label: string;
}
