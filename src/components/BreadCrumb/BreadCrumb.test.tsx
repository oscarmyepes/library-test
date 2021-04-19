/* eslint-disable sort-keys */
import { render } from '@testing-library/react';
import * as React from 'react';
import BreadCrumb from './BreadCrumb';

describe('BreadCrumb', () => {
  const PATHS = {
    separator: '>',
    list: [
      { label: 'Home', url: 'http://google.com' },
      { label: 'Exterior', url: 'http://google.com' },
      { label: 'Truck Bed', url: 'http://google.com' },
      { label: 'Tonneau Covers', url: 'http://google.com' },
      { label: 'Product Page', url: 'http://google.com' },
    ],
  };
  const FILTERS = [
    { id: 1, label: 'fitment: 2010 Ford F-150', color: '#feeeb6' },
    { id: 2, label: 'Bed Length: 6', color: '#cddffa' },
    { id: 3, label: 'keyword: tonneau cover', color: '#f8f8f8' },
    { id: 4, label: 'brand: Retrax', color: '#f8f8f8' },
    { id: 5, label: 'brand: Extang', color: '#f8f8f8' },
  ];

  const onBreadcumbClick = jest.fn();
  const onRemoveFilter = jest.fn();

  beforeAll(() => jest.resetAllMocks());

  it('Should render all paths and filters and call onBreadcumbClick and onRemoveFilter', async () => {
    const pathToSelect = PATHS.list[0];
    const filterToSelect = FILTERS[0];

    const { getByText, getAllByLabelText } = render(
      <BreadCrumb
        paths={PATHS}
        filters={FILTERS}
        onBreadcumbClick={onBreadcumbClick}
        onRemoveFilter={onRemoveFilter}
      />
    );

    PATHS.list.forEach((path) => {
      expect(getByText(path.label)).toBeInTheDocument();
    });
    FILTERS.forEach((path) => {
      expect(getByText(path.label)).toBeInTheDocument();
    });

    const pathToClick = getByText(pathToSelect.label);
    pathToClick.click();

    expect(onBreadcumbClick).toHaveBeenCalledWith(pathToSelect);

    const filterToClick = getAllByLabelText('clear');
    filterToClick[0].click();

    expect(onRemoveFilter).toHaveBeenCalledWith(filterToSelect);
  });

  it('Should render breadcrumb collapsed and expand on ellipsis click', async () => {
    const { getByText, getAllByRole } = render(
      <BreadCrumb
        paths={{ ...PATHS, maxItems: 2 }}
        onBreadcumbClick={onBreadcumbClick}
      />
    );
    expect(getByText(PATHS.list[0].label)).toBeInTheDocument();
    expect(
      getByText(PATHS.list[PATHS.list.length - 1].label)
    ).toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(3);

    const ellipsis = getByText('...');
    ellipsis.click();

    PATHS.list.forEach((path) => {
      expect(getByText(path.label)).toBeInTheDocument();
    });
    expect(getAllByRole('listitem')).toHaveLength(5);
  });

  it('Should render custom separator and custom Link for paths', async () => {
    const drunkSeparator = '🥴';
    const { getAllByText } = render(
      <BreadCrumb
        paths={{
          ...PATHS,
          separator: drunkSeparator,
          linkEl: function Link({ children }: { children: React.ReactNode }) {
            return (
              <h1>
                I am the link <span>{children}</span>
              </h1>
            );
          },
        }}
        onBreadcumbClick={onBreadcumbClick}
      />
    );

    expect(getAllByText(drunkSeparator)).toHaveLength(PATHS.list.length - 1);
    expect(getAllByText('I am the link')).toHaveLength(PATHS.list.length);
  });
});
