import { SearchBarProps, SearchbarSection } from '../SearchBar/models';

export interface SearchbarWrapperSection
  extends Omit<SearchbarSection, 'data'> {
  maxResults?: number;
}

export interface SearchBarWrapperProps
  extends Omit<
    SearchBarProps,
    'isLoading' | 'onChange' | 'onClear' | 'renderNoResults' | 'sections'
  > {
  /**
   * List of sections to show, we support `categories`, `brands` and `products` sections.
   */
  sections?: SearchbarWrapperSection[];
}
