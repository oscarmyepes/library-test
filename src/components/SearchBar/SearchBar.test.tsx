import { act, fireEvent, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { stringify } from 'querystring';
import * as React from 'react';
import restFactory from '../../utils/restFactory';
import { SearchBarProps } from './models';
import SearchBar from './SearchBar';
import { createResultItem } from './__mocks__/searchResults';

describe('SearchBar', () => {
  const SITE = 'test';
  const MAX_RESULTS = 4;
  const SEARCH_TEXT = 'eng';
  const PRODUCTS = Array.from({ length: MAX_RESULTS }).map((item, index) =>
    createResultItem({ id: String(index), title: `Product ${index}` })
  );

  const query = {
    maxcount: MAX_RESULTS,
    search: SEARCH_TEXT,
    site: SITE,
  };

  const renderSearch = (props: Partial<SearchBarProps> = {}) =>
    render(<SearchBar site={SITE} maxResults={MAX_RESULTS} {...props} />);

  beforeEach(() => {
    fetchMock.getOnce(
      `${process.env.SEARCH_API_URL}/products?${stringify(query)}`,
      { result: PRODUCTS }
    );
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

  it('Should show custom properties and call API with custom maxResults', async () => {
    const spyRestfactory = jest.spyOn(restFactory, 'get');
    const props = {
      listTitle: 'List title',
      maxResults: 8,
      resultsHeaderText: 'Header results',
      searchButtonText: 'Search me',
    };
    fetchMock.getOnce(
      `${process.env.SEARCH_API_URL}/products?${stringify({
        ...query,
        maxcount: props.maxResults,
      })}`,
      { result: PRODUCTS }
    );
    const { getByLabelText, getAllByRole, findByText } = renderSearch(props);
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });
    await waitFor(() =>
      expect(getAllByRole('listitem').length).toEqual(MAX_RESULTS)
    );

    await findByText(props.listTitle);
    await findByText(`${props.resultsHeaderText}: ${SEARCH_TEXT}`);
    await findByText(props.searchButtonText);

    expect(spyRestfactory).toHaveBeenCalledWith(
      `${process.env.SEARCH_API_URL}/products`,
      {
        maxcount: props.maxResults,
        search: SEARCH_TEXT,
        site: SITE,
      }
    );
  });

  it('Should clear results and set error when API returns error', async () => {
    const error = 'My error';
    fetchMock.getOnce(
      `${process.env.SEARCH_API_URL}/products?${stringify(query)}`,
      { throws: { message: error } },
      { overwriteRoutes: true }
    );
    const { getByText, getByLabelText } = renderSearch();
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    await waitFor(() =>
      expect(
        getByText(`${error}. Please check your stite property (${SITE}).`)
      ).toBeDefined()
    );
  });

  it('Should show no results message', async () => {
    fetchMock.getOnce(
      `${process.env.SEARCH_API_URL}/products?${stringify(query)}`,
      { result: [] },
      { overwriteRoutes: true }
    );
    const { getByText, getByLabelText } = renderSearch();
    const input = getByLabelText('search-input');
    fireEvent.change(input, { target: { value: SEARCH_TEXT } });

    await waitFor(() =>
      expect(getByText(`No results for: ${SEARCH_TEXT}`)).toBeDefined()
    );
  });

  it('Should not call API when user deletes characters from input in less time than keystrokeDelay', async () => {
    const spyRestFactory = jest.spyOn(restFactory, 'get');
    const { getByLabelText } = renderSearch({ keystrokeDelay: 5 });
    const input = getByLabelText('search-input');

    fireEvent.change(input, { target: { value: SEARCH_TEXT } });
    await delay(1);
    fireEvent.change(input, { target: { value: SEARCH_TEXT.slice(0, 2) } });
    await delay(1);
    fireEvent.change(input, { target: { value: '' } });

    await waitFor(() => expect(spyRestFactory).toHaveBeenCalledTimes(0));
  });
});

function delay(amount: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, amount)
  );
}
