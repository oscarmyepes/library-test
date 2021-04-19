// Interface for ProductListItem props

import { BasicItem, Product, VisibleField } from '../../models/search';

// Mapped visible fields into Sections
export interface VisibleFieldsSections {
  title?: VisibleField<Pick<Product, 'title'>>;
  prices?: VisibleField<Pick<Product, 'sale' | 'price'>>[];
  labels?: VisibleField<Omit<Product, 'sale' | 'price' | 'title'>>[];
  rating?: VisibleField<Pick<Product, 'rating_count'>>;
}

type SearchbarSectionType = BasicItem | Product;

type SearchBarTypes = 'product' | 'category' | 'brand';

export interface SearchbarSection {
  /**
   * The type of the the section is an unique name for each section.
   */
  type: SearchBarTypes;
  /**
   * The section title, this is the text that will be visible in the suggestions results.
   */
  title: string;
  /**
   * The visible fields for products. This property is only used for **products** section because `category` and `brand`
   * only have and image and a title.
   */
  visibleFields?: VisibleField<Product>[];
  /**
   * The list of suggestions for each section.
   */
  data: { list: Array<SearchbarSectionType>; total: number };
  /**
   * Callback fired when user clicks the view more button on each section
   *
   * The View more button will be visible **only** if you send this callback and the
   * `total > list.length` in the data property
   */
  onViewMoreClick?: (
    section: Omit<SearchbarSection, 'onViewMoreClick'>
  ) => void;
  /**
   * The text for the view more button
   */
  viewMoreButtonText?: string;
}

export interface RenderListData {
  brand: { title: string; list: BasicItem };
  category: { title: string; list: BasicItem };
  product: { title: string; list: Product };
}

export interface SearchBarProps {
  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * Flag to indicate when there is a search in progress.
   */
  isLoading?: boolean;
  /**
   * Whether you prefer to render each item in an anchor tag, React route Link or any other link component.
   */
  linkEl?: React.ElementType;
  /**
   * Text to show when there are no results for the current search.
   */
  noResultsText?: string;
  /**
   * The onChange callback function for the search input.
   *
   * This function is debounced, so will be called after 250ms which is our
   * default delay to prevent multiple calls at the same time.
   *
   */
  onChange?: (value: string) => void;
  /**
   * Function called when user clicks the cross icon to clear the input
   */
  onClear?: () => void;
  /**
   * This function is called when user clicks Search/Ok button.
   */
  onSubmit?: (search: string) => void;
  /**
   * Callback fired when user clicks one of the suggestions.
   */
  onItemClick?: (data: BasicItem | Product) => void;
  /**
   * Placeholder for the search input.
   */
  placeholder?: string;
  /**
   * Callback function to render custom no result component.
   */
  renderNoResults?: () => void;
  /**
   * Callback function to render custom suggestions list.
   */
  renderList?: (data: RenderListData) => JSX.Element;

  /**
   * List of sections to show, we support `categories`, `brands` and `products` sections.
   */
  sections: SearchbarSection[];

  /**
   * Text for the search button.
   */
  searchButtonText?: string;
  /**
   * Flag to show the no results message, could be the default message
   * or the one you passed in `noResultsText` property.
   */
  showNoResultsMsg?: boolean;
  /**
   * The inital search string.
   */
  searchValue?: string;
  /**
   * Flag to show a cross icon on the right of the search input to clear the input value.
   */
  showCloseIcon?: boolean;
  /**
   * If you want to use our default styles, set this property to `true`.
   */
  styled?: boolean;
}

export interface ProductItemProps
  extends Pick<SearchBarProps, 'linkEl' | 'styled'> {
  suggestion: Product;
  visibleFields: SearchbarSection['visibleFields'];
}

export interface BasicItemProps extends Pick<SearchBarProps, 'linkEl'> {
  suggestion: BasicItem;
}
