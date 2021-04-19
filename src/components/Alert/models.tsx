export interface AlertProps {
  /**
   * The title of the alert.
   *
   *
   * Can be a string or a React.ReactNode
   * ```
   * <h1>Requires fitment</h1>
   * ```
   *
   * `string`
   */
  title: string | React.ReactNode;
  /**
   * Button text.
   *
   * The button will be visible only if you pass the `onClick` callback and the `buttonText` properties
   */
  buttonText?: string;

  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * If you want the alert to have a background color, set fill to `true`.
   *
   * This only works if you have **styled=true**
   */
  fill?: boolean;
  /**
   * Callback function executed when user clicks the button.
   *
   * The button will be visible only if you pass the `onClick` callback and the `buttonText` properties
   */
  onClick?: () => void;
  /**
   * If you want to hide the icon, set this property to `false`
   */
  showIcon?: boolean;
  /**
   * The inline styles for this component
   */
  style?: React.CSSProperties;
  /**
   * If you don't want to use our default styles, set this property to `false`.
   */
  styled?: boolean;
  /**
   * The alert could be one of three types
   */
  type: 'success' | 'error' | 'warning';
  /**
   * Text to add more details besides the title.
   *
   * Can be a string or a React.ReactNode
   * ```
   * <>
   *  <p>2020 Chevy Colorado</p>
   *  <p>6'2" Bed</p>
   * </>
   * ```
   *
   * `string`
   */
  text?: React.ReactNode | string;
}
