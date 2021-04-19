import { FacetFilterProps } from '../FacetFilter/models';

export interface FacetFilterWrapperProps
  extends Omit<FacetFilterProps, 'data'> {
  search: string;
}
