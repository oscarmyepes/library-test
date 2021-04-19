import { render } from '@testing-library/react';
import * as React from 'react';
import { toCurrency } from '../../utils/format';
import ProductListItem from './ProductListItem';
import { createProductItem } from '../../__mocks__/searchResults';

describe('ProductListItem', () => {
  const STYLED_CLASS_NAMES = [
    'styledSearchResultItem',
    'styledSearchResultItemCurrentPrice',
  ];

  const PRODUCT = createProductItem();

  it('Should render ProductListItem with default labels', async () => {
    const defaultFields = ['title', 'brand_name', 'dealerid', 'sale', 'price'];

    const { getByText, container } = render(
      <ProductListItem data={createProductItem()} />
    );

    expect(getByText(PRODUCT.title)).toBeDefined();
    expect(getByText(PRODUCT.brand_name)).toBeDefined();
    expect(getByText(PRODUCT.dealerid)).toBeDefined();
    expect(getByText(toCurrency(PRODUCT.sale))).toBeDefined();
    expect(getByText(toCurrency(PRODUCT.price))).toBeDefined();
    checkClassNames(
      container,
      defaultFields.map((field) => `Sui-ProductListItem--${field}`)
    );
  });

  it('Should render ProductListItem with custom labels', async () => {
    const { getByText, container } = render(
      <ProductListItem
        data={createProductItem()}
        visibleFields={[
          { prop: 'title' },
          { label: 'CONDITION: ', prop: 'condition' },
        ]}
      />
    );

    expect(getByText(PRODUCT.title)).toBeDefined();
    expect(getByText(PRODUCT.condition)).toBeDefined();
    checkClassNames(
      container,
      ['title', 'condition'].map((field) => `Sui-ProductListItem--${field}`)
    );
  });

  it('Should render elements with styled class names', async () => {
    const { container } = render(
      <ProductListItem data={createProductItem()} styled={true} />
    );

    checkClassNames(container, STYLED_CLASS_NAMES);
  });
});

function checkClassNames(container: Element, classNames: string[]) {
  classNames.forEach((className) =>
    expect(container.querySelector(`.${className}`)).not.toBeNull()
  );
}
