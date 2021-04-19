import { env } from '../config';

export const PRODUCTS_URL = `${env.API_URL}/products`;
export const FACET_FILTERS_URL = `${env.API_URL}/attributes`;
export const CATEGORIES_URL = `${env.API_URL}/categories`;

export function getProductsQuery(
  page: number,
  itemsPerPage: number,
  search: string
) {
  return {
    limit: itemsPerPage,
    page,
    q: search,
  };
}
