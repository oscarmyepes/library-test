// Interface for items returned by BE
export interface Product {
  id: string;
  availability?: string;
  brand_name?: string;
  condition?: string;
  dealerid?: string;
  image_url?: string;
  price?: number;
  product_url?: string;
  remarks?: string;
  sale?: number;
  thumb_url?: string;
  title?: string;
  tag?: string;
  rating_count?: number;
  url?: string;
  [key: string]: string | number;
}

export interface ListResponse<T> {
  total: number;
  list: T[];
}

export interface VisibleField<T> {
  prop: keyof T;
  label?: string;
}

export type FacetFiltersDataType = 'priceRange' | '';

export type FacetFiltersValues = Array<
  string | number | [number | string, (number | string)?]
>;

export interface FacetFiltersData {
  [key: string]: {
    title: string;
    type?: FacetFiltersDataType;
    order: number;
    collapsed?: boolean;
    values: FacetFiltersValues;
  };
}

export interface BasicItem {
  /**
   * The id of the item.
   */
  id: number | string;
  /**
   * The name of the item.
   */
  name: string;
  /**
   * Image url of the item. If this is sent as an empty string a placeholder will be shown as category image.
   */
  image_url?: string;
  /**
   * The url to redirect the user when clicking the item. If this property is not sent, the item will
   * be rendered in a `div` container instead of a link container.
   */
  url?: string;
}

export interface CategoryResponse {
  total: number;
  list: BasicItem[];
}
