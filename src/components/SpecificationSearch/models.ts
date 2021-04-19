export interface SpecificationSearchProps {
  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * An array of tuples containing product attribute name and attributes value.
   */
  data: [string, string][];
  /**
   *
   */
  noMatchesText?: string;
  /**
   * Placeholder for the search input.
   */
  placeholder?: string;
  /**
   * The initial value to search for attribute names and attributes values.
   */
  searchValue?: string;
  /**
   * Flag to show a cross icon on the right of the search input to clear the input value.
   */
  showClearIcon?: boolean;
  /**
   * If you want to use our default styles, set this property to `true`.
   */
  styled?: boolean;
}
