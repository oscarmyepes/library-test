import {
  FacetFiltersData,
  FacetFiltersDataType,
  FacetFiltersValues,
} from '../../models/search';

export interface FacetFilterValues {
  [key: string]: Array<string | number> | null;
}

export interface FacetFilterOnChange {
  section?: string;
  newValue?: string | number;
  isChecked?: boolean;
  selectedValues?: FacetFilterValues;
}

export interface FacetFilterProps {
  /**
   * An object containing all sections and data for each section to configure filters.
   */
  data: FacetFiltersData;
  /**
   * Function called every time user checks or unchekcs a filter.
   */
  onChange?: (value: FacetFilterOnChange | unknown) => void;
  /**
   * If you want to use our default styles, set this property to `true`.
   */
  styled?: boolean;
  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * If you want to show the Clear all button, send this flag as TRUE.
   */
  showClearAll?: boolean;
  /**
   *  If you want to have radio buttons instead of checkboxes, set this flag to true.
   */
  isSingleSelect?: boolean;
  /**
   * If you want to enable expand/collapse send this flag as TRUE.
   */
  enableCollapse?: boolean;
  /**
   * If a section contains too many filters, you can configure how many items should be visible
   * for each section.
   *
   * If a section contains 20 filters and you set this limit to 10, a `show more` button will be displayed.
   */
  listLimit?: number;
  /**
   * Selected values is an object which values must be an array of strings.
   *
   * Example:
   * ```
   * {"price":["0, 50","100, 200"],"brand_name":["Brand 1","brand 2"]}
   * ```
   */
  selectedValues?: FacetFilterValues;
  /**
   * The title for this filter.
   */
  title?: string;
  /**
   * Render props component function to render any component when there is no data for this filter.
   */
  renderNoResults?: () => JSX.Element;
}

export interface FacetSectionProps
  extends Pick<FacetFilterProps, 'isSingleSelect'> {
  onChange: (value: string | number) => void;
  values: FacetFiltersValues;
  selectedValues: Array<string | number>;
  className?: string;
  limit?: number;
  styled?: boolean;
  type?: FacetFiltersDataType;
}

export interface FacetPriceSectionProps
  extends Omit<FacetSectionProps, 'onChange'> {
  onChange: (value: Array<[number, number]>) => void;
}

export interface FacetSectionCheckbox
  extends Pick<FacetFilterProps, 'isSingleSelect'> {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  styled?: boolean;
}

export interface FacetFilterState {
  [key: string]: Set<string | number>;
}
