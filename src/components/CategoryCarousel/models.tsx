import { ResponsiveObject, Settings } from 'react-slick';
import { BasicItem } from '../../models/search';

export interface CategoryCarouselProps {
  /**
   * The list to be rendered.
   */
  list: BasicItem[];
  /**
   * The [react-slick](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-slick/index.d.ts#L24)
   * responsive object.
   *
   * Example
   * ```
   * [ { "breakpoint": 1000, "settings": { "slidesToShow": 25, "slidesToScroll": 1 } } ]
   * ```
   */
  responsive?: ResponsiveObject[];
  /**
   * You can use our custom sizes sending the size property with any of the listed values.
   *
   * If you need a different size, you can customize how many items want to render using the `responsive`
   * object and change the size of each item with css.
   */
  size?: 'lg' | 'md' | 'sm';
  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * Whether you prefer to render each item in an anchor tag, React route Link or any other link component.
   */
  linkEl?: React.ElementType;
  /**
   * Callback fired when user clicks a list item.
   */
  onItemClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    data: BasicItem
  ) => void;
}

export interface ResponsiveObjectSlick {
  /**
   * Breakpoint to apply custom settings configuration.
   */
  breakpoint: number;
  /**
   * The [react-slick](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-slick/index.d.ts#L33)
   * settings object
   */
  settings: Settings;
}
