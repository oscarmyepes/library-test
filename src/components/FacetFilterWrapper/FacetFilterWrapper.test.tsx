/* eslint-disable sort-keys */
import { act, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import { FACET_FILTERS_URL } from '../../utils/queryUtils';
import FacetFilterWrapper from '.';
import { stringify } from 'querystring';
import set from 'lodash/fp/set';

const defaultResponse = {
  brand_names: {
    order: 1,
    title: 'Brands',
    values: ['ACCESS Covers', 'Air Lift', 'AirAid'],
  },
  conditions: { order: 2, title: 'Condition', values: ['New', 'Used'] },
  prices: {
    order: 3,
    title: 'Price',
    type: 'priceRange',
    values: [[0, 25], [25, 50], [50, 100], [100, 200], [200]],
  },
};

describe('FacetFilterWrapper', () => {
  const SEARCH = 'eng';

  const mockResponse = (response, search = SEARCH) =>
    fetchMock.getOnce(`${FACET_FILTERS_URL}?q=${search}`, response, {
      delay: 0,
    });

  afterEach(() => {
    fetchMock.reset();
    jest.clearAllMocks();
  });

  it('Should show all attributes and trigger on change when an attribute is checked', async () => {
    mockResponse(defaultResponse);
    const onChange = jest.fn();
    const selectedValueOne = defaultResponse.brand_names.values[0];
    const selectedValueTwo = defaultResponse.conditions.values[1];
    fetchMock.getOnce(
      `${FACET_FILTERS_URL}?${stringify({
        q: SEARCH,
        brand_names: selectedValueOne,
      })}`,
      defaultResponse,
      {
        delay: 0,
      }
    );
    fetchMock.getOnce(
      `${FACET_FILTERS_URL}?${stringify({
        q: SEARCH,
        brand_names: selectedValueOne,
        conditions: selectedValueTwo,
      })}`,
      defaultResponse,
      {
        delay: 0,
      }
    );

    const { findByText, findAllByRole } = render(
      <FacetFilterWrapper onChange={onChange} search={SEARCH} />
    );

    const brandValue = await findByText(selectedValueOne);
    brandValue.click();
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        isChecked: true,
        newValue: selectedValueOne,
        section: 'brand_names',
        selectedValues: { brand_names: [selectedValueOne] },
      })
    );
    expect(await (await getCheckedFilters(findAllByRole)).length).toBe(1);

    const condValue = await findByText(selectedValueTwo);
    condValue.click();
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        isChecked: true,
        newValue: selectedValueTwo,
        section: 'conditions',
        selectedValues: {
          brand_names: [selectedValueOne],
          conditions: [selectedValueTwo],
        },
      })
    );
    expect(await (await getCheckedFilters(findAllByRole)).length).toBe(2);
  });

  it('Should clear all selected attributes', async () => {
    mockResponse(defaultResponse);
    const onChange = jest.fn();
    const { findByText, findAllByRole } = render(
      <FacetFilterWrapper
        onChange={onChange}
        search={SEARCH}
        showClearAll
        selectedValues={{
          brand_names: defaultResponse.brand_names.values,
        }}
      />
    );

    expect(await (await getCheckedFilters(findAllByRole)).length).toBe(
      defaultResponse.brand_names.values.length
    );

    const clearBtn = await findByText('Clear all');
    fetchMock.reset();
    mockResponse(defaultResponse);
    clearBtn.click();

    expect(await (await getCheckedFilters(findAllByRole)).length).toBe(0);
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('Should show "Show more" button when there are more items than configured limit', async () => {
    const response = set(
      'brand_names.values',
      Array.from({ length: 10 }).map((_, index) => String(index))
    )(defaultResponse);

    mockResponse(response);
    const limit = 5;
    const allCheckboxes = Object.keys(response).reduce((acc, item) => {
      const checkboxes =
        item !== 'priceRange' ? response[item].values.length : 0;
      return acc + Math.min(limit, checkboxes);
    }, 0);
    const visibleCheckboxes = allCheckboxes - limit;

    const { findByText, findAllByRole } = render(
      <FacetFilterWrapper onChange={null} listLimit={limit} search={SEARCH} />
    );

    const showMore = await findByText('Show more...');
    expect(
      ((await findAllByRole('checkbox')) as HTMLInputElement[]).length
    ).toBe(visibleCheckboxes);

    await act(async () => showMore.click());

    expect(
      ((await findAllByRole('checkbox')) as HTMLInputElement[]).length
    ).toBe(allCheckboxes);
    expect(await findByText('Show less')).toBeDefined();
  });

  it('Should show prices as range', async () => {
    mockResponse(defaultResponse);
    const { findByText } = render(
      <FacetFilterWrapper onChange={null} search={SEARCH} />
    );
    await findByText('Under $25');
    await findByText('$25 to $50');
    await findByText('$200 & Above');
  });

  it('Should render hidden selected checkboxes', async () => {
    mockResponse(
      set(
        'brand_names.values',
        Array.from({ length: 10 }).map((_, index) => `Brand ${index + 1}`)
      )(defaultResponse)
    );
    const selectedBrand = 'Brand 8';
    const { findByText, queryByText } = render(
      <FacetFilterWrapper
        search={SEARCH}
        onChange={null}
        listLimit={5}
        selectedValues={{ brand_names: [selectedBrand] }}
      />
    );
    await findByText(selectedBrand);
    expect(queryByText('Brand 7')).not.toBeInTheDocument();
    expect(queryByText('Brand 9')).not.toBeInTheDocument();
  });

  it('Should call onChange function with NULL when there are no selected filters', async () => {
    mockResponse(defaultResponse);
    const onChange = jest.fn();
    const selectedValue = defaultResponse.brand_names.values[0];
    fetchMock.getOnce(
      `${FACET_FILTERS_URL}?${stringify({
        q: SEARCH,
        brand_names: selectedValue,
      })}`,
      defaultResponse,
      {
        delay: 0,
      }
    );

    const { findByText } = render(
      <FacetFilterWrapper search={SEARCH} onChange={onChange} />
    );

    const brandValue = await findByText(selectedValue);
    brandValue.click();
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        isChecked: true,
        newValue: selectedValue,
        section: 'brand_names',
        selectedValues: {
          brand_names: [selectedValue],
        },
      })
    );
    fetchMock.reset();
    mockResponse(defaultResponse);
    brandValue.click();
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        isChecked: false,
        newValue: selectedValue,
        section: 'brand_names',
        selectedValues: null,
      })
    );
  });

  it('Should call API with new search string to update attributes filter', async () => {
    mockResponse(defaultResponse);
    const responseForNewSearch = {
      ...defaultResponse,
      brand_names: {
        ...defaultResponse.brand_names,
        values: ['Brand new search', ...defaultResponse.brand_names.values],
      },
    };
    const newSearchStr = 'piston';
    mockResponse(responseForNewSearch, newSearchStr);
    const { findByText, rerender } = render(
      <FacetFilterWrapper search={SEARCH} onChange={null} />
    );
    await findByText(defaultResponse.brand_names.values[0]);

    rerender(<FacetFilterWrapper search={newSearchStr} onChange={null} />);

    await findByText(responseForNewSearch.brand_names.values[0]);
  });

  it('Should update values when is used as a controlled component', async () => {
    mockResponse(defaultResponse);
    const filterOne = defaultResponse.brand_names.values[0];
    const filterTwo = defaultResponse.brand_names.values[1];
    const { findAllByRole, rerender } = render(
      <FacetFilterWrapper
        search={SEARCH}
        onChange={null}
        selectedValues={{ brand_names: [filterOne] }}
      />
    );

    let selectedCheckbox = await getCheckedFilters(findAllByRole);
    expect(selectedCheckbox.length).toBe(1);
    expect(selectedCheckbox[0].value).toBe(filterOne);

    rerender(
      <FacetFilterWrapper
        search={SEARCH}
        onChange={null}
        selectedValues={{ brand_names: [filterOne, filterTwo] }}
      />
    );

    selectedCheckbox = await getCheckedFilters(findAllByRole);
    expect(selectedCheckbox.length).toBe(2);
    expect(selectedCheckbox[0].value).toBe(filterOne);
    expect(selectedCheckbox[1].value).toBe(filterTwo);
  });

  it('Should render custom no results element', async () => {
    mockResponse({});
    const noResultMsg = 'Custom no results';
    const { findAllByText } = render(
      <FacetFilterWrapper
        search={SEARCH}
        onChange={null}
        renderNoResults={() => <h1>{noResultMsg}</h1>}
      />
    );
    await findAllByText(noResultMsg);
  });

  it('Should call loadData on every change', async () => {
    mockResponse(defaultResponse);
    const valueToSelect = defaultResponse.brand_names.values[1];
    const filteredAttributesUrl = `${FACET_FILTERS_URL}?${stringify({
      q: SEARCH,
      brand_names: valueToSelect,
    })}`;
    fetchMock.getOnce(filteredAttributesUrl, defaultResponse, {
      delay: 0,
    });
    const { findByText } = render(
      <FacetFilterWrapper search={SEARCH} onChange={null} />
    );
    const checkbox = await findByText(valueToSelect);
    checkbox.click();

    await waitFor(() =>
      expect(fetchMock.lastUrl()).toBe(filteredAttributesUrl)
    );
  });
});

async function getCheckedFilters(findAllByRole) {
  return ((await findAllByRole('checkbox')) as HTMLInputElement[]).filter(
    (checkbox) => checkbox.checked
  );
}
