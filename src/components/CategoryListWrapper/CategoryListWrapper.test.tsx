import { act, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { stringify } from 'querystring';
import * as React from 'react';
import { env } from '../../config';
import { CategoryResponse } from '../../models/search';
import CategoryListWrapper from './CategoryListWrapper';
import { CategoryListWrapperProps } from './models';

describe('CategoryListWrapper', () => {
  const ITEMS_PER_PAGE = 10;
  const SEARCH = 'engine';

  const mockResponse = (
    page = 1,
    itemsPerPage = ITEMS_PER_PAGE,
    query = null
  ) => {
    const list = Array.from({ length: itemsPerPage }).map((_, index) => ({
      id: String(index),
      image_url: '',
      name: `Category ${index}`,
    }));
    fetchMock.getOnce(
      `${env.API_URL}/categories?${stringify({
        limit: itemsPerPage,
        page: page,
        ...query,
      })}`,
      { list, total: list.length * 10 } as CategoryResponse,
      {
        delay: 0,
      }
    );

    return list;
  };

  afterEach(() => {
    fetchMock.reset();
    jest.clearAllMocks();
  });

  const buildComponent = ({
    itemsPerPage = ITEMS_PER_PAGE,
    page = 1,
    orientation = 'horizontal',
    onPageChanged = undefined,
    showPagination = true,
    showControls = true,
    query = null,
    onItemClick = null,
  } = {}) => (
    <CategoryListWrapper
      itemsPerPage={itemsPerPage}
      currentPage={page}
      orientation={orientation as CategoryListWrapperProps['orientation']}
      onPageChanged={onPageChanged}
      showPagination={showPagination}
      showControls={showControls}
      query={query}
      onItemClick={onItemClick}
    />
  );

  it('Should render items for first page', async () => {
    const page = 1;
    mockResponse(page);
    const { findAllByRole } = render(buildComponent());

    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, page))
    );
    const results = await findAllByRole('listitem');
    expect(results.length).toBe(ITEMS_PER_PAGE);
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
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, page))
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
    expect(fetchMock.lastUrl()).toBe(matchUrl(itemsPerPage, 1));

    await act(async () => await rerender(buildComponent({ itemsPerPage: 10 })));
    await waitFor(() => expect(fetchMock.lastUrl()).toBe(matchUrl(10, 1)));
    const results2 = await findAllByRole('listitem');
    await waitFor(() => expect(results2.length).toBe(10));
  });

  it('Should set the selected page to 1 when query changes', async () => {
    const newSearchTxt = 'test';
    const newItemsPerPage = 5;
    const query = { q: SEARCH };
    const query2 = { q: newSearchTxt };
    mockResponse(2, ITEMS_PER_PAGE, query);
    mockResponse(2, ITEMS_PER_PAGE, query2);
    mockResponse(1, newItemsPerPage, query2);

    const { rerender, getAllByRole } = render(
      buildComponent({ page: 2, query })
    );

    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, 2, query))
    );
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toBe(ITEMS_PER_PAGE)
    );

    // When changing the search text
    rerender(buildComponent({ page: 2, query: query2 }));
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, 2, query2))
    );
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toBe(ITEMS_PER_PAGE)
    );

    // When changing itemsPerPage
    rerender(
      buildComponent({
        itemsPerPage: newItemsPerPage,
        query: query2,
      })
    );
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(
        matchUrl(newItemsPerPage, 1, { q: newSearchTxt })
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
    await waitFor(() => expect(fetchMock.lastUrl()).toBe(matchUrl(10, 3)));
    expect(onPageChanged).toHaveBeenCalledWith(3);
  });

  it('Should render no results text', async () => {
    fetchMock.getOnce(
      `${env.API_URL}/categories?${stringify({
        limit: ITEMS_PER_PAGE,
        page: 1,
      })}`,
      { list: [], total: 0 } as CategoryResponse,
      {
        delay: 0,
      }
    );
    const { getByText } = render(buildComponent());
    await waitFor(() => expect(getByText('No results')).toBeDefined);
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
    const items = Array.from({ length: itemsPerPage }).map((_, index) => ({
      id: String(index),
      image_url: '',
      name: `Category ${index}`,
    }));
    fetchMock.getOnce(
      `${env.API_URL}/categories?${stringify({
        limit: itemsPerPage,
        page: 1,
      })}`,
      { list: items, total: totalItems } as CategoryResponse,
      {
        delay: 0,
      }
    );

    const { getByTestId, findAllByRole } = render(
      buildComponent({ itemsPerPage, page: 1 })
    );
    await waitFor(() => expect(getByTestId('pagination')).toBeInTheDocument());
    const pageButtons = await findAllByRole('button');
    expect(
      pageButtons.find((item) => item.innerHTML === String(expectedTotalPages))
    ).toBeDefined();
  });

  it('Should call API with received query params', async () => {
    const query = { brand_name: 'Test' };
    mockResponse(1, ITEMS_PER_PAGE, query);
    render(buildComponent({ query }));
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, 1, query))
    );
  });

  it('Should have Sui-List--container class', async () => {
    // The className Sui-List--container is important in other components to customize styles
    // for that reason we add a test to check the class exists.
    const query = { brand_name: 'Test' };
    mockResponse(1, ITEMS_PER_PAGE, query);
    const { container } = render(buildComponent({ query }));
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, 1, query))
    );

    expect(container.querySelector('.Sui-List--container')).toBeInTheDocument();
  });

  it('Should call onItemClick when user clicks a list item and the callback is configured', async () => {
    const onItemClick = jest.fn();
    const list = mockResponse(1, ITEMS_PER_PAGE);
    const { findAllByRole } = render(buildComponent({ onItemClick }));
    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(matchUrl(ITEMS_PER_PAGE, 1))
    );

    const items = await findAllByRole('listitem');

    items[0].click();
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ _reactName: 'onClick' }),
      list[0]
    );
    onItemClick.mockReset();
    items[1].click();
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ _reactName: 'onClick' }),
      list[1]
    );
  });
});

function matchUrl(itemPerPage: number, page: number, query = {}) {
  return `${env.API_URL}/categories?${stringify({
    limit: itemPerPage,
    page: page,
    ...query,
  })}`;
}
