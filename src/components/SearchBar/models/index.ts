// Interface for items returned by BE
export interface ResultItem {
  availability: string;
  brand_name: string;
  condition: string;
  dealerid: string;
  googlebase_category: string;
  id: string;
  image_urls: string[];
  inventory: number;
  meta_description: string;
  meta_keywords: string;
  price: number;
  product_url: string[];
  remarks: string;
  sale: number;
  score: number;
  stockid: string;
  thumb_urls: string[];
  title: string;
}

// Interface for SearchResultItem props

export interface VisisbleField<T> {
  prop: keyof T;
  label?: string;
}
export interface SearchResultItemProps {
  data: ResultItem;
  styled?: boolean;
  visibleFields?: VisisbleField<ResultItem>[];
  className?: string;
}

// Mapped visible fields into Sections
export interface VisibleFieldsSections {
  title?: VisisbleField<Pick<ResultItem, 'title'>>;
  prices?: VisisbleField<Pick<ResultItem, 'sale' | 'price'>>[];
  labels?: VisisbleField<Omit<ResultItem, 'sale' | 'price' | 'title'>>[];
}

export interface SearchBarProps {
  maxResults: number;
  site: string;
  className?: string;
  keystrokeDelay?: number; // Debounce in ms
  linkEl?: React.ElementType;
  listTitle?: string;
  minSearchCharacters?: number;
  noResultsText?: string;
  placeholder?: string;
  resultsHeaderText?: string;
  searchButtonText?: string;
  showCloseIcon?: boolean;
  styled?: boolean;
  visibleFields?: VisisbleField<ResultItem>[];
}
