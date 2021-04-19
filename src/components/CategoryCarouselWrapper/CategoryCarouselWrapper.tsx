import * as React from 'react';
import useFetch from '../../common/customHooks/useFetch';
import { CategoryResponse } from '../../models/search';
import { CATEGORIES_URL } from '../../utils/queryUtils';
import CategoryCarousel from '../CategoryCarousel/CategoryCarousel';
import { CategoryCarouselWrapperProps } from './models';

const CategoryCarouselWrapper = ({
  query,
  ...carouselProps
}: CategoryCarouselWrapperProps) => {
  const [loadData, state] = useFetch<CategoryResponse>();

  React.useEffect(() => {
    loadData(CATEGORIES_URL, {
      limit: 10,
      page: 1,
      ...(query || {}),
    });
  }, [query]);

  if (state.status === 'RESOLVED' && !state.data?.list.length) {
    return <h1>No data</h1>;
  } else if (state.status !== 'RESOLVED') {
    return null;
  }

  return <CategoryCarousel list={state.data.list} {...carouselProps} />;
};

export default CategoryCarouselWrapper;
