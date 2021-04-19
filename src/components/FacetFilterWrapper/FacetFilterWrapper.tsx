import * as React from 'react';
import useFetch from '../../common/customHooks/useFetch';
import { FacetFiltersData } from '../../models/search';
import { FACET_FILTERS_URL } from '../../utils/queryUtils';
import FacetFilter from '../FacetFilter/FacetFilter';
import { FacetFilterOnChange } from '../FacetFilter/models';
import { FacetFilterWrapperProps } from './models';

const FacetFilterWrapper = ({
  search,
  selectedValues: initialSelectedValues = null,
  title = 'Filters',
  onChange,
  ...facetProps
}: FacetFilterWrapperProps) => {
  const [loadData, state] = useFetch<FacetFiltersData>();

  /*
    Every time the search text changes, we reset the selected filters to show
    consistent data/filters
  */
  React.useEffect(() => {
    loadData(`${FACET_FILTERS_URL}?q=${search}`);
  }, [search]);

  const _onChange = (data: FacetFilterOnChange) => {
    let query = {};
    if (data?.selectedValues) {
      for (const key in data.selectedValues) {
        if (key === 'price') {
          query = {
            ...query,
            [key]: data.selectedValues[key]
              .map((item) => (item as string).split(',').join('-'))
              .join(','),
          };
        } else {
          query = { ...query, [key]: data.selectedValues[key].join(',') };
        }
      }
    }
    loadData(`${FACET_FILTERS_URL}`, { q: search, ...query });
    onChange?.(data);
  };

  return (
    <FacetFilter
      {...facetProps}
      data={state.data}
      selectedValues={initialSelectedValues}
      title={title}
      onChange={_onChange}
    />
  );
};

export default FacetFilterWrapper;
