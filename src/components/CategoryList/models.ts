import { ListProps } from '../../common/List/List';
import { BasicItem } from '../../models/search';

export interface CategoryListProps
  extends Omit<ListProps<BasicItem>, 'children'> {
  /**
   * The list to be rendered.
   */
  list: BasicItem[];
  /**
   * Callback function to render custom list items.
   */
  renderList?: (data: BasicItem[]) => JSX.Element;
  /**
   * Whether you prefer to render each item in an anchor tag, React route Link or any other link component.
   */
  linkEl?: React.ElementType;
}
