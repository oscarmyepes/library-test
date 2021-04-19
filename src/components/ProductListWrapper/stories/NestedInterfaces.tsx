import { Product, ListResponse, VisibleField } from '../../../models/search';

export const SearchResponseComp = (_: ListResponse<Product>) => null;
export const ResultItemComp = (_: Product) => null;
export const VisibleFieldComp = (_: VisibleField<Product>) => null;
