import { render } from '@testing-library/react';
import * as React from 'react';
import { toCurrency } from '../../utils/format';
import SearchResultItem from './SearchResultItem';
import { createResultItem } from './__mocks__/searchResults';

describe('SearchResultItem', () => {
  const STYLED_CLASS_NAMES = [
    'StyledSearchResultItem',
    'StyledSearchResultItemCurrentPrice',
  ];

  const PRODUCT = createResultItem();

  it('Should render SearchResultItem with default labels', async () => {
    const defaultFields = ['title', 'brand_name', 'dealerid', 'sale', 'price'];

    const { getByText, container } = render(
      <SearchResultItem data={createResultItem()} />
    );

    expect(getByText(PRODUCT.title)).toBeDefined();
    expect(getByText(PRODUCT.brand_name)).toBeDefined();
    expect(getByText(PRODUCT.dealerid)).toBeDefined();
    expect(getByText(toCurrency(PRODUCT.sale))).toBeDefined();
    expect(getByText(toCurrency(PRODUCT.price))).toBeDefined();
    checkClassNames(
      container,
      defaultFields.map((field) => `Sui-SearchResultItem--${field}`)
    );
  });

  it('Should render SearchResultItem with custom labels', async () => {
    const { getByText, container } = render(
      <SearchResultItem
        data={createResultItem()}
        visibleFields={[
          { prop: 'title' },
          { prop: 'condition', label: 'CONDITION: ' },
        ]}
      />
    );

    expect(getByText(PRODUCT.title)).toBeDefined();
    expect(getByText(PRODUCT.condition)).toBeDefined();
    checkClassNames(
      container,
      ['title', 'condition'].map((field) => `Sui-SearchResultItem--${field}`)
    );
  });

  it('Should render elements with styled class names', async () => {
    const { container } = render(
      <SearchResultItem data={createResultItem()} styled={true} />
    );

    checkClassNames(container, STYLED_CLASS_NAMES);
  });
});

function checkClassNames(container: HTMLElement, classNames: string[]) {
  classNames.forEach((className) =>
    expect(container.querySelector(`.${className}`)).not.toBeNull()
  );
}
