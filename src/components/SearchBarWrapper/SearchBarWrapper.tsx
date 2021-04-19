import classnames from 'classnames';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { useFetchAll } from '../../common/customHooks/useFetch';
import { env } from '../../config';
import { BasicItem, Product, ListResponse } from '../../models/search';
import { getProductsQuery } from '../../utils/queryUtils';
import SearchBar, { KEY_STROKE_DELAY } from '../SearchBar/SearchBar';
import { SearchBarWrapperProps } from './models';
import styles from './styles.scss';

let controller = new AbortController();
let signal = controller.signal;
export const DEFAULT_MAX_RESULTS = 5;
const DEFAULT_SECTION = [
  { maxResults: DEFAULT_MAX_RESULTS, title: 'Categories', type: 'category' },
  { maxResults: DEFAULT_MAX_RESULTS, title: 'Brands', type: 'brand' },
  { maxResults: DEFAULT_MAX_RESULTS, title: 'Products', type: 'product' },
] as SearchBarWrapperProps['sections'];

const URL_PER_SECTION = {
  brand: `${env.API_URL}/brands`,
  category: `${env.API_URL}/categories`,
  product: `${env.API_URL}/products`,
};

const MIN_SEARCH_CHARACTERS = 1;

const SearchBarWrapper = ({
  className,
  linkEl = 'a',
  noResultsText,
  placeholder = 'Enter keyword',
  searchButtonText = 'Search',
  showCloseIcon,
  styled,
  onSubmit,
  showNoResultsMsg = true,
  searchValue: searchString = '',
  sections = DEFAULT_SECTION,
  renderList,
  onItemClick,
}: SearchBarWrapperProps) => {
  const validSections =
    !Array.isArray(sections) || sections.length === 0
      ? DEFAULT_SECTION
      : sections;

  const [loadSearchData, searchState, dispatch] = useFetchAll<
    [ListResponse<BasicItem>, ListResponse<BasicItem>, ListResponse<Product>]
  >();

  const loading = searchState.status === 'LOADING';
  const hasData = searchState?.data?.reduce(
    (acc, item) => acc + (item.list?.length || 0),
    0
  );

  // resultsFor is the last successful text searched
  const [resultsFor, setResultsFor] = React.useState('');
  const [searchValue, setSearchValue] = React.useState(searchString);

  React.useEffect(() => {
    reset();
  }, [sections]);

  const loadData = React.useCallback(
    debounce(async (value: string) => {
      if (value.length >= MIN_SEARCH_CHARACTERS) {
        const requests = validSections.map((section) => ({
          query: getProductsQuery(1, section.maxResults || 5, value),
          signal,
          url: URL_PER_SECTION[section.type],
        }));

        await loadSearchData(requests);

        setResultsFor(value);
      } else {
        reset();
      }
    }, KEY_STROKE_DELAY),
    [sections, MIN_SEARCH_CHARACTERS]
  );

  const onChange = (value: string) => {
    setSearchValue(value);
    // To prevent rendering data for old BE calls we cancel pending requests before making a new one
    if (searchState.status === 'LOADING') {
      controller.abort();
      controller = new AbortController();
      signal = controller.signal;
    }
    loadData(value);
  };

  const showNoResults = () =>
    !loading &&
    searchValue === resultsFor &&
    searchValue.length >= MIN_SEARCH_CHARACTERS &&
    !hasData;

  const renderNoResultsText = (message: string) => (
    <p
      className={classnames(
        {
          [styles.styledNoResults]: styled,
        },
        'Sui-SearchBar--no-results'
      )}
    >
      {message}
    </p>
  );

  const renderErrorOrNoResultsMessage = () => {
    if (searchState.status === 'REJECTED' && searchValue === resultsFor) {
      // We want to show this text if there is an error and all requests have finished.
      // We know requests have finished when searchValue === resultsFor
      return renderNoResultsText(`${searchState.error}.`);
    } else if (showNoResults()) {
      return renderNoResultsText(
        noResultsText || `No results for: ${resultsFor}`
      );
    }
    return null;
  };

  const clear = () => {
    setSearchValue('');
    reset();
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
    setResultsFor('');
  };

  return (
    <>
      <SearchBar
        className={className}
        linkEl={linkEl}
        noResultsText={noResultsText}
        placeholder={placeholder}
        searchButtonText={searchButtonText}
        showCloseIcon={showCloseIcon}
        styled={styled}
        onSubmit={onSubmit}
        showNoResultsMsg={showNoResultsMsg}
        searchValue={searchValue}
        renderNoResults={renderErrorOrNoResultsMessage}
        onClear={clear}
        onChange={onChange}
        isLoading={loading}
        sections={validSections.map((section, index) => ({
          ...section,
          data: {
            list: searchState.data?.[index]?.list || [],
            total: searchState.data?.[index]?.total || 0,
          },
        }))}
        renderList={renderList}
        onItemClick={onItemClick}
      />
    </>
  );
};

export default SearchBarWrapper;
