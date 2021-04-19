/* eslint-disable sort-keys */
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useState } from 'react';
import ProductListWrapper from '../../../components/ProductListWrapper';
import { SearchbarWrapperSection } from '../../../components/SearchBarWrapper/models';
import SearchBarWrapper from '../../../components/SearchBarWrapper/SearchBarWrapper';
import { config } from '../../../config';
import styles from './styles.scss';

export default {
  component: null,
  title: 'Pages/ClientA',
} as Meta;

const sections: SearchbarWrapperSection[] = [
  { maxResults: 6, title: 'Categories', type: 'category' },
  { maxResults: 6, title: 'Brands', type: 'brand' },
  {
    maxResults: 6,
    title: 'Products',
    type: 'product',
    onViewMoreClick: () => alert('View more button clicked'),
    viewMoreButtonText: 'View more products',
  },
];

export const Search = () => {
  const [isApiKeyConfigured, setIsApiKeyCOnfigured] = useState(false);
  const [search, setSearch] = useState('Lun');
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    config({ API_KEY: '22e5026d-7cb8-4f9d-9439-a409d0e3b816' });
    setIsApiKeyCOnfigured(true);

    return () => config({ API_KEY: null });
  }, []);

  if (!isApiKeyConfigured) return null;

  return (
    <div className={styles.root}>
      <div className={styles.right}>
        <SearchBarWrapper
          onSubmit={setSearch}
          styled
          showNoResultsMsg={true}
          searchValue={search}
          sections={sections}
        />

        <ProductListWrapper
          className={styles.resultList}
          itemsPerPage={5}
          search={search}
          showPagination={true}
          showControls={totalData > 0}
          orientation="vertical"
          styled
          onDataReceived={(data) => setTotalData(data?.total || 0)}
        />
      </div>
    </div>
  );
};
Search.parameters = {
  actions: { disable: false },
  controls: { disable: false },
  previewTabs: { 'storybook/docs/panel': { hidden: true } },
};
