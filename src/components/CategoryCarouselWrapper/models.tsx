import { GenericObject } from '../../models/generic';
import { CategoryCarouselProps } from '../CategoryCarousel/models';

export interface CategoryCarouselWrapperProps
  extends Omit<CategoryCarouselProps, 'list'> {
  query?: GenericObject;
}
