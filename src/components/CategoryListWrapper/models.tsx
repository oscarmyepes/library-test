import { GenericObject } from '../../models/generic';
import { CategoryListProps } from '../CategoryList/models';

export interface CategoryListWrapperProps
  extends Omit<CategoryListProps, 'list' | 'isLoading' | 'totalPages'> {
  /**
   * Query to send to our category API endpoint. Please have a look at our API documentation for more details.
   */
  query?: GenericObject;
}
