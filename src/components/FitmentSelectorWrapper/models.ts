import { Error, Orientation } from '../../models/generic';
import {
  CustomSelect,
  FitmentSelectorProps,
  Item,
  SelectedValues,
} from '../FitmentSelector/models';

export interface FitmentSelectorWrapperProps {
  /**
   * If `true`, the **FitmentSelector** wont' have OK/Cancel buttons.
   *
   * The `onChange` function will be called on every select change and the `onSubmit` function
   * will be called when all selects have a value and after the number of milliseconds configured in
   * `autocommitDelay` has passed (default delay is 2 seconds).
   */
  autocommit?: boolean;
  /**
   * Delay in milliseconds to trigger the `onSubmit` function when `autocommit` is `true`
   */
  autocommitDelay?: number;
  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * Text for Cancel button.
   */
  clearButtonText?: string;
  /**
   * Property to pass custom components. At this moment a custom select is supported, so you can use
   * something like `react-select`.
   * The element must be passed in this way:
   * ```
   * {
   *   components: {
   *     select: (props) => <WithCustomSelect props={props} />,
   *   }
   * }
   * ```
   */
  components?: {
    select?: React.ElementType<CustomSelect>;
  };
  /**
   * To configure a filter, pass an object where each key/value will be converted to a query param.
   * Please review our API documentation to confirm what query params are supported.
   * Example:
   * ```
   * { search: "Product name" }
   * ```
   * Will be converted to
   * ```"?search=Product name"```
   */
  filter?: { [key: string]: string | number };
  /**
   * Component container id
   */
  id?: string;
  /**
   * The group orientation (layout flow direction).
   */
  orientation?: Orientation;
  /**
   * Function to be called on every select change.
   *
   * When user clicks clear button, this function is called with `(null, null)`
   */
  onChange?: (labelId: number | string, values: SelectedValues) => void;
  /**
   * Function called every time the FitmentSelector fetches data from the API
   */
  onDataLoaded?: (
    labels: Item[],
    optionalLabels: Item[],
    data: FitmentSelectorProps['labelsData']
  ) => void;
  /**
   * Function called when the API returns an error
   */
  onError?: (error: Error) => void;
  /**
   * This function is called when user clicks OK button or if the component is
   * configured with autocommit in `true`, all selects have a selected value
   * and the `autocommitDelay` has passed.
   */
  onSubmit?: (values: SelectedValues) => void;
  /**
   * Ok button text
   */
  searchButtonText?: string;
  /**
   * Object representing values for each select.
   *
   * Example:
   * ```
   * {
   *  Year: '1'
   * }
   * ```
   * Where **Year** is the label name and '1' is the labelData id.
   *
   * Send this object when you want to see default selected values. The component
   * internally controls what values are selected.
   */
  selectedValues?: SelectedValues;
  /**
   * The inline styles for this component
   */
  style?: React.CSSProperties;
  /**
   * If you want to use our default styles, set this property to `true`.
   */
  styled?: boolean;
}
