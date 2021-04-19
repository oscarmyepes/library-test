import { FitmentSelectorWrapperProps } from '../FitmentSelectorWrapper/models';

export interface FitmentSelectorVerifierProps
  extends FitmentSelectorWrapperProps {
  /**
   * Title for FitmentSelector section
   */
  title?: string;
  /**
   * Text for Button/Link when user can't see the vehicle he is looking for.
   *
   * The callback function will be executed and user can do any action they want to show
   * for instance a modal with a Fitment showing all values
   */
  showMoreText?: string;
  /**
   * Callback function called when user clicks the text at the bottom to perform any needed action
   */
  onShowMoreBtnClick?: () => void;
  /**
   * The title of the success alert.
   *
   *
   * Can be a string or a React.ReactNode
   * ```
   * <h1>FITMENT VERIFIED FOR:</h1>
   * ```
   *
   * `string`
   */
  alertSuccessTitle?: string | React.ReactNode;
  /**
   * The title of the error alert.
   *
   *
   * Can be a string or a React.ReactNode
   * ```
   * <h1>Requires fitment</h1>
   * ```
   *
   * `string`
   */
  alertErrorTitle?: string | React.ReactNode;
  /**
   * Button text.
   *
   * The button will be visible only if you pass the `onClick` callback and the `buttonText` properties
   */
  alertButtonText?: string;

  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * If you want the alert to have a background color, set fill to `true`.
   *
   * This only works if you have **styled=true**
   */
  alertFill?: boolean;

  /**
   * If you want to hide the icon, set this property to `false`
   */
  showAlertIcon?: boolean;
}
