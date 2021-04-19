import { act, fireEvent, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { stringify } from 'querystring';
import * as React from 'react';
import { env } from '../../config';
import { BasicItem, ListResponse, Product } from '../../models/search';
import { getProductsQuery } from '../../utils/queryUtils';
import restFactory from '../../utils/restFactory';
import { createProductItem } from '../../__mocks__/searchResults';
import { delay } from '../../__mocks__/utils';
import SearchBarWrapper, {
  DEFAULT_MAX_RESULTS,
} from '../SearchBarWrapper/SearchBarWrapper';
import { SearchBarWrapperProps, SearchbarWrapperSection } from './models';
import omit from 'lodash/fp/omit';

describe('SearchBarWrapper', () => {
  const MAX_RESULTS = 4;
  const SEARCH_TEXT = 'eng';
  const PRODUCTS = Array.from({ length: MAX_RESULTS }).map((item, index) =>
    createProductItem({ id: String(index), title: `Product ${index}` })
  );
  const RESPONSE: ListResponse<Product> = {
    list: PRODUCTS,
    total: PRODUCTS.length * 10,
  };

  const query = getProductsQuery(1, MAX_RESULTS, SEARCH_TEXT);

  const renderSearch = (props: Partial<SearchBarWrapperProps> = {}) =>
    render(
      <SearchBarWrapper
        {...props}
        sections={
          props.sections || [
            { maxResults: MAX_RESULTS, title: 'Products', type: 'product' },
          ]
        }
      />
    );

  beforeEach(() => {
    fetchMock.getOnce(`${env.API_URL}/products?${stringify(query)}`, RESPONSE);
  });

  afterEach(() => {
    fetchMock.reset();
    jest.clearAllMocks();
  });

  it('Should show result items when input has min search characters to trigger search', async () => {
    const spyRestFactory = jest.spyOn(restFactory, 'get');
    const { getByLabelText, getAllByRole } = renderSearch();
    const input = getByLabelText('search-input');

    fireEvent.change(input, { target: { value: SEARCH_TEXT[0] } });
    expect(spyRestFactory).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: SEARCH_TEXT.slice(0, 2) } });
    expect(spyRestFactory).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: SEARCH_TEXT } });
    await waitFor(() => expect(spyRestFactory).toHaveBeenCalledTimes(1));

    await waitFor(() =>
      expect(getAllByRole('listitem').length).toEqual(MAX_RESULTS)
    );
  });

  it('Should clear input and hide result list after clicking close button', async () => {
    const { getByLabelText, getAllByRole, queryByText } = renderSearch({
      showCloseIcon: true,
    });
    const input = getByLabelText('search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toEqual(MAX_RESULTS)
    );

    const clearButton = getByLabelText('clear');
    await act(async () => clearButton.click());
    expect(input.value).toEqual('');
    expect(queryByText(PRODUCTS[0].title)).toBeNull();
  });

  it('Should call API with custom maxResults', async () => {
    const customMaxResults = 2;
    const props: Partial<SearchBarWrapperProps> = {
      searchButtonText: 'Search me',
      sections: [
        { maxResults: customMaxResults, title: 'Products', type: 'product' },
      ],
    };
    fetchMock.getOnce(
      `${env.API_URL}/products?${stringify({
        ...query,
        limit: customMaxResults,
      })}`,
      { ...RESPONSE, list: RESPONSE.list.slice(0, customMaxResults) }
    );
    const { getByLabelText, getAllByRole, findByText } = renderSearch(props);
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toEqual(customMaxResults)
    );

    await findByText(props.searchButtonText);

    expect(fetchMock.lastUrl()).toEqual(
      `${env.API_URL}/products?${stringify(
        getProductsQuery(1, customMaxResults, 'eng')
      )}`
    );
  });

  it('Should clear results and set error when API returns error', async () => {
    const error = 'My error';
    fetchMock.getOnce(
      `${env.API_URL}/products?${stringify(query)}`,
      { throws: { message: error } },
      { overwriteRoutes: true }
    );
    const { getByText, getByLabelText } = renderSearch();
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    await waitFor(() => expect(getByText(`${error}.`)).toBeDefined());
  });

  it('Should show no results message', async () => {
    fetchMock.getOnce(
      `${env.API_URL}/products?${stringify(query)}`,
      { list: [], total: 0 } as ListResponse<Product>,
      { overwriteRoutes: true }
    );
    const { getByText, getByLabelText } = renderSearch();
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    await waitFor(() =>
      expect(getByText(`No results for: ${SEARCH_TEXT}`)).toBeDefined()
    );
  });

  it('Should render Products, Categories and Brands', async () => {
    const categories: BasicItem[] = Array.from({
      length: DEFAULT_MAX_RESULTS,
    }).map((_, index) => ({ id: index + 1, name: `Category ${index + 1}` }));

    const brands: BasicItem[] = Array.from({
      length: DEFAULT_MAX_RESULTS,
    }).map((_, index) => ({ id: index + 1, name: `Brand ${index + 1}` }));

    const products = Array.from({
      length: DEFAULT_MAX_RESULTS,
    }).map((_, index) =>
      createProductItem({ id: String(index), title: `Product ${index + 1}` })
    );

    fetchMock.getOnce(
      `${env.API_URL}/categories?${stringify({
        ...query,
        limit: DEFAULT_MAX_RESULTS,
      })}`,
      { list: categories, total: categories }
    );
    fetchMock.getOnce(
      `${env.API_URL}/brands?${stringify({
        ...query,
        limit: DEFAULT_MAX_RESULTS,
      })}`,
      { list: brands, total: brands.length }
    );
    fetchMock.getOnce(
      `${env.API_URL}/products?${stringify({
        ...query,
        limit: DEFAULT_MAX_RESULTS,
      })}`,
      { list: products, total: products.length }
    );
    const { getByLabelText, getAllByRole, findByText } = renderSearch({
      sections: [],
    });
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    await findByText('Categories');
    await findByText('Brands');
    await findByText('Products');
    await findByText('Category 1');
    await findByText('Category 5');
    await findByText('Brand 1');
    await findByText('Brand 5');
    await findByText('Product 1');
    await findByText('Product 5');

    await waitFor(() =>
      expect(getAllByRole('listitem').length).toEqual(DEFAULT_MAX_RESULTS * 3)
    );
  });

  it('Should call onItemClick when a suggestion is clicked', async () => {
    const onItemClick = jest.fn();
    const { findByText, getByLabelText } = renderSearch({ onItemClick });
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    const suggestion = await findByText(PRODUCTS[0].title);
    suggestion.click();

    await waitFor(() => expect(onItemClick).toHaveBeenCalledWith(PRODUCTS[0]));
  });

  it('Should call onViewMore function', async () => {
    const sections: SearchbarWrapperSection[] = [
      {
        maxResults: MAX_RESULTS,
        onViewMoreClick: jest.fn(),
        title: 'Products',
        type: 'product',
        viewMoreButtonText: 'View more products',
      },
    ];
    const { findByText, getByLabelText } = renderSearch({ sections });
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    const viewMoreBtn = await findByText(sections[0].viewMoreButtonText);
    viewMoreBtn.click();

    expect(sections[0].onViewMoreClick).toHaveBeenCalledWith({
      ...omit('onViewMoreClick')(sections[0]),
      data: RESPONSE,
    });
  });

  it('Should render custom suggestions list', async () => {
    const { findByText, getByLabelText } = renderSearch({
      renderList: () => <h1>I am the custom list</h1>,
    });
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    await findByText('I am the custom list');
  });

  it('Should not call API when user deletes characters from input in less time than keystrokeDelay', async () => {
    const spyRestFactory = jest.spyOn(restFactory, 'get');
    const { getByLabelText } = renderSearch();
    const input = getByLabelText('search-input');

    fireEvent.change(input, { target: { value: SEARCH_TEXT } });
    await delay(1);
    fireEvent.change(input, { target: { value: SEARCH_TEXT.slice(0, 2) } });
    await delay(1);
    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => expect(spyRestFactory).toHaveBeenCalledTimes(0));
  });

  it('Should call onSubmit function', () => {
    const onSubmit = jest.fn();
    const { getByText, getByLabelText } = renderSearch({ onSubmit });
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });
    const submitButton = getByText('Search');
    submitButton.click();
    expect(onSubmit).toHaveBeenCalledWith(SEARCH_TEXT);
  });
});
