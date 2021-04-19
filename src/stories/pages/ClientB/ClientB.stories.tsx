import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect, useState } from 'react';
import ProductListWrapper from '../../../components/ProductListWrapper';
import SearchBarWrapper from '../../../components/SearchBarWrapper/SearchBarWrapper';
import { config } from '../../../config';
import styles from './styles.scss';

export default {
  component: null,
  title: 'Pages/ClientB',
} as Meta;

export const Search = () => {
  const [isApiKeyConfigured, setIsApiKeyCOnfigured] = useState(false);
  const [search, setSearch] = useState('boss');
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    config({ API_KEY: 'bda24892-036f-4e2b-999d-7463feb0bbd9' });
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
