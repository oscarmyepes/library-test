import debounce from 'lodash/debounce';
import * as React from 'react';
import useFetch from '../../common/customHooks/useFetch';
import { DEFAULT_VISIBLE_FIELDS } from '../../common/ProductListItem/ProductListItem';
import { Product, ListResponse } from '../../models/search';
import { getProductsQuery, PRODUCTS_URL } from '../../utils/queryUtils';
import ProductList from '../ProductList/ProductList';
import { ProductListWrapperProps } from './models';
import styles from './styles/listWrapper.scss';

const ProductListWrapper = ({
  className = '',
  styled,
  orientation = 'horizontal',
  search,
  itemsPerPage = 5,
  currentPage: page = 1,
  showPagination = false,
  onPageChanged = () => null,
  onDataReceived = () => null,
  showControls = false,
  showLoadingIndicator = false,
  visibleFields = DEFAULT_VISIBLE_FIELDS,
  renderList,
  renderNoResults: renderNoResultsCustom,
  query,
  linkEl,
  onItemsPerPageChange,
  onItemClick,
  onLayoutChange,
  noImageUrl,
}: ProductListWrapperProps) => {
  const [loadData, state] = useFetch<ListResponse<Product>>();
  const [currentPage, setCurrentPage] = React.useState(page);
  const [itemsPerPageInternal, setItemsPerPage] = React.useState(itemsPerPage);
  const wasRendered = React.useRef(false);

  /*
      Debounce function to prevent multiple calls when user is in a different page than
      the first one and then changes the search string.
      When that happens the effect that depends on search and the effect that depends on 
      page will both call loadData function almost at the same time, this happens only when
      user is sending the page as param.
    */
  const _loadData = React.useCallback(
    debounce(
      (_page: number, _itemsPerPage: number, _search: string, _query) => {
        loadData(PRODUCTS_URL, {
          ...getProductsQuery(_page, _itemsPerPage, _search),
          ..._query,
        });
      },
      1 // 1 is just to wait until the call stack is empty to prevent multiple calls at the same time
    ),
    []
  );

  React.useEffect(() => {
    setItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  // This effect should run only when the search string or items per page have changed.
  // We only want to set the current page to 1 in this scenario.
  React.useEffect(() => {
    let pageToQuery = currentPage;
    // This conditional is to prevent calling the API on first render,
    // the hook that listen for page changes will make the first call.
    if (wasRendered.current) {
      setCurrentPage(1);
      onPageChanged(1);
      pageToQuery = 1;
      if (search) {
        _loadData(pageToQuery, itemsPerPageInternal, search, query);
      }
    }
    wasRendered.current = true;
  }, [search, itemsPerPageInternal, query]);

  React.useEffect(() => {
    setCurrentPage(page);
    if (search) {
      _loadData(page, itemsPerPageInternal, search, query);
    }
  }, [page]);

  React.useEffect(() => {
    onDataReceived(state.data);
  }, [state.data]);

  const onChangePage = (newPage: number) => {
    setCurrentPage(newPage);
    onPageChanged(newPage);
    _loadData(newPage, itemsPerPageInternal, search, query);
  };

  const renderNoResults = () => {
    switch (state.status) {
      case 'RESOLVED':
        return renderNoResultsCustom ? (
          renderNoResultsCustom()
        ) : (
          <h4 className={styles.noResultsText}>
            No results for current search
          </h4>
        );
      case 'REJECTED':
        return <h4 className={styles.noResultsText}>{state.error}</h4>;
      default:
        break;
    }

    return null;
  };

  const list = state.data?.list || [];
  const totalPages = Math.ceil((state.data?.total || 0) / itemsPerPageInternal);
  const isBusy = state.status === 'LOADING';

  return (
    <div className={className}>
      <ProductList
        styled={styled}
        orientation={orientation}
        showPagination={showPagination}
        onPageChanged={onChangePage}
        showLoadingIndicator={showLoadingIndicator}
        visibleFields={visibleFields}
        renderList={renderList}
        renderNoResults={renderNoResults}
        list={list}
        totalPages={totalPages}
        currentPage={currentPage}
        isLoading={isBusy}
        linkEl={linkEl}
        showControls={showControls}
        itemsPerPage={itemsPerPageInternal}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          onItemsPerPageChange?.(value);
        }}
        onItemClick={onItemClick}
        onLayoutChange={onLayoutChange}
        noImageUrl={noImageUrl}
      />
    </div>
  );
};

export default ProductListWrapper;
