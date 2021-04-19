import * as React from 'react';
import useFetch from '../../common/customHooks/useFetch';
import { CategoryResponse } from '../../models/search';
import { CATEGORIES_URL } from '../../utils/queryUtils';
import CategoryList from '../CategoryList/CategoryList';
import { CategoryListWrapperProps } from './models';

const CategoryListWrapper = ({
  currentPage: page = 1,
  itemsPerPage = 5,
  orientation = 'horizontal',
  query,
  onPageChanged,
  onItemClick,
  ...listProps
}: CategoryListWrapperProps) => {
  const [loadData, state] = useFetch<CategoryResponse>();
  const [currentPage, setCurrentPage] = React.useState(page);
  const [itemsPerPageInternal, setItemsPerPage] = React.useState(itemsPerPage);

  React.useEffect(() => {
    loadData(CATEGORIES_URL, {
      limit: itemsPerPageInternal,
      page: currentPage,
      ...query,
    });
  }, [currentPage, itemsPerPageInternal, query]);

  React.useEffect(() => {
    if (itemsPerPage !== itemsPerPageInternal) {
      setCurrentPage(1);
    }
    setItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil((state.data?.total || 0) / itemsPerPageInternal);

  if (state.status === 'REJECTED') {
    return <p>{state.error}</p>;
  }

  return (
    <CategoryList
      {...listProps}
      currentPage={currentPage}
      itemsPerPage={itemsPerPageInternal}
      onItemsPerPageChange={(value) => {
        setItemsPerPage(value);
      }}
      orientation={orientation}
      list={state.data?.list || []}
      totalPages={totalPages}
      onPageChanged={(value) => {
        setCurrentPage(value);
        onPageChanged?.(value);
      }}
      isLoading={state.status !== 'RESOLVED'}
      onItemClick={onItemClick}
    />
  );
};

export default CategoryListWrapper;
