import { act, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { stringify } from 'querystring';
import * as React from 'react';
import { env } from '../../config';
import { Product, ListResponse } from '../../models/search';
import { getProductsQuery } from '../../utils/queryUtils';
import { createProductItem } from '../../__mocks__/searchResults';
import { ProductListProps } from '../ProductList/models';
import ProductListWrapper from './ProductListWrapper';

describe('ProductListWrapper', () => {
  const ITEMS_PER_PAGE = 10;
  const SEARCH = 'engine';

  const mockResponse = (
    page = 1,
    itemsPerPage = ITEMS_PER_PAGE,
    search = SEARCH,
    query = null
  ) => {
    const list = Array.from({ length: itemsPerPage }).map((_, index) =>
      createProductItem({
        id: String(index),
        title: `Product ${index} page ${page}`,
      })
    );
    fetchMock.getOnce(
      `${env.API_URL}/products?${stringify({
        ...getProductsQuery(page, itemsPerPage, search),
        ...query,
      })}`,
      { list, total: list.length * 10 } as ListResponse<Product>,
      {
        delay: 0,
      }
    );
  };

  afterEach(() => {
    fetchMock.reset();
    jest.clearAllMocks();
  });

  const buildComponent = ({
    itemsPerPage = ITEMS_PER_PAGE,
    page = 1,
    search = SEARCH,
    orientation = 'horizontal',
    onPageChanged = undefined,
    showPagination = true,
    showControls = true,
    query = null,
  } = {}) => (
    <ProductListWrapper
      search={search}
      itemsPerPage={itemsPerPage}
      currentPage={page}
      orientation={orientation as ProductListProps['orientation']}
      onPageChanged={onPageChanged}
      showPagination={showPagination}
      showControls={showControls}
      query={query}
    />
  );

  it('Should render items for first page', async () => {
    const page = 1;
    mockResponse(page);
    const { findAllByRole } = render(buildComponent());
    const results = await findAllByRole('listitem');

    expect(results.length).toBe(ITEMS_PER_PAGE);
    expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, page, SEARCH));
  });

  it('Should render items for second page', async () => {
    const page = 2;
    mockResponse(page - 1);
    mockResponse(page);
    const { findAllByRole, findByTestId } = render(buildComponent());
    const results = await findAllByRole('listitem');
    const pagination = await findByTestId('pagination');

    (pagination.childNodes[2] as HTMLButtonElement).click();

    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, page, SEARCH))
    );
    expect(results.length).toBe(ITEMS_PER_PAGE);
  });

  it('Should render a list of maximun number of items per page configured with itemsPerPage property', async () => {
    const itemsPerPage = 5;
    mockResponse(1, itemsPerPage);
    mockResponse(1, 10);
    const { findAllByRole, rerender } = render(
      buildComponent({ itemsPerPage })
    );
    const results = await findAllByRole('listitem');

    expect(results.length).toBe(itemsPerPage);
    expect(fetchMock.lastUrl()).toBe(matchUrl(itemsPerPage, 1, SEARCH));

    await act(async () => await rerender(buildComponent({ itemsPerPage: 10 })));
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(10, 1, SEARCH))
    );
    const results2 = await findAllByRole('listitem');
    await waitFor(() => expect(results2.length).toBe(10));
  });

  it('Should set the selected page to 1 when search text or pagePerItem changes', async () => {
    const newSearchTxt = 'test';
    const newItemsPerPage = 5;
    mockResponse(2, ITEMS_PER_PAGE);
    mockResponse(1, ITEMS_PER_PAGE, newSearchTxt);
    mockResponse(1, newItemsPerPage, newSearchTxt);
    const { rerender, getAllByRole } = render(buildComponent({ page: 2 }));

    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, 2, SEARCH))
    );
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toBe(ITEMS_PER_PAGE)
    );

    // When changing the search text
    rerender(buildComponent({ page: 2, search: newSearchTxt }));
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(
        matchUrl(ITEMS_PER_PAGE, 1, newSearchTxt)
      )
    );
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toBe(ITEMS_PER_PAGE)
    );

    // When changing itemsPerPage
    rerender(
      buildComponent({ itemsPerPage: newItemsPerPage, search: newSearchTxt })
    );
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(
        matchUrl(newItemsPerPage, 1, newSearchTxt)
      )
    );
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toBe(newItemsPerPage)
    );
  });

  it('Should update orientation when user clicks Grid or List icons', async () => {
    mockResponse();
    const { findByLabelText, findByTestId } = render(buildComponent());

    const listBtn = (await findByLabelText('list layout')) as HTMLButtonElement;
    const listContainer = await findByTestId('listContainer');
    listBtn.click();
    expect(listContainer.className).toContain('listHorizontal');

    const gridBtn = (await findByLabelText('grid layout')) as HTMLButtonElement;
    gridBtn.click();
    expect(listContainer.className).not.toContain('listHorizontal');
  });

  it('Should call onPageChanged and call API with selected page', async () => {
    mockResponse();
    mockResponse(3);
    const onPageChanged = jest.fn();
    const { findByTestId, findAllByRole } = render(
      buildComponent({ onPageChanged })
    );
    await findByTestId('pagination');
    const pageButtons = await findAllByRole('button');
    const page3 = pageButtons.find((item) => item.innerHTML === '3');
    await act(async () => page3.click());
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(10, 3, SEARCH))
    );
    expect(onPageChanged).toHaveBeenCalledWith(3);
  });

  it('Should render no results text', async () => {
    fetchMock.getOnce(
      `${env.API_URL}/products?${stringify(
        getProductsQuery(1, ITEMS_PER_PAGE, SEARCH)
      )}`,
      { list: [], total: 0 } as ListResponse<Product>,
      {
        delay: 0,
      }
    );
    const { getByText } = render(buildComponent());
    await waitFor(
      () => expect(getByText('No results for current search')).toBeDefined
    );
  });

  it('Should not render pagination if showPagination = false', async () => {
    mockResponse();
    const { findByTestId, queryByTestId, rerender } = render(buildComponent());
    await findByTestId('pagination');

    rerender(buildComponent({ showPagination: false }));
    await waitFor(() => {
      expect(queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  it('Should show the correct number of pages', async () => {
    const itemsPerPage = 8;
    const totalItems = 101;
    const expectedTotalPages = Math.ceil(totalItems / itemsPerPage);
    const items = Array.from({ length: itemsPerPage }).map((_, index) =>
      createProductItem({
        id: String(index),
        title: `Product ${index}`,
      })
    );
    fetchMock.getOnce(
      `${env.API_URL}/products?${stringify(
        getProductsQuery(1, itemsPerPage, SEARCH)
      )}`,
      { list: items, total: totalItems } as ListResponse<Product>,
      {
        delay: 0,
      }
    );

    const { findByTestId, findAllByRole } = render(
      buildComponent({ itemsPerPage, page: 1, search: SEARCH })
    );
    await findByTestId('pagination');
    const pageButtons = await findAllByRole('button');
    expect(
      pageButtons.find((item) => item.innerHTML === String(expectedTotalPages))
    ).toBeDefined();
  });

  it('Should call API with received query params', async () => {
    const query = { brand_name: 'Test' };
    mockResponse(1, ITEMS_PER_PAGE, SEARCH, query);
    render(buildComponent({ query }));
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(
        matchUrl(ITEMS_PER_PAGE, 1, SEARCH, query)
      )
    );
  });
});

function matchUrl(
  itemPerPage: number,
  page: number,
  search: string,
  query = {}
) {
  return `${env.API_URL}/products?${stringify({
    ...getProductsQuery(page, itemPerPage, search),
    ...query,
  })}`;
}
