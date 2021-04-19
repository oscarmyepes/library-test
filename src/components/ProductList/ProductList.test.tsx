import { render } from '@testing-library/react';
import * as React from 'react';
import { toCurrency } from '../../utils/format';
import ProductList from './ProductList';

describe('ProductList', () => {
  const product = {
    availability: '',
    id: '23232',
    price: 123,
    rating_count: 1,
    sale: 456,
    title: 'Product title',
  };
  it('Should render custom labels', async () => {
    const visibleFields = [
      { prop: 'title' },
      { prop: 'price' },
      { prop: 'sale' },
      { label: "I'm a custom label", prop: 'custom' },
      { prop: 'notVisible' },
    ];
    const { getByText, container } = render(
      <ProductList
        list={[product]}
        totalPages={10}
        currentPage={1}
        visibleFields={visibleFields}
      />
    );

    const labelContainer = container.querySelector(
      '.Sui-ProductListItem--label-container'
    );

    expect(getByText(product.title)).toBeDefined();
    expect(getByText(toCurrency(product.price))).toBeDefined();
    expect(getByText(toCurrency(product.sale))).toBeDefined();
    expect(getByText(visibleFields[3].label)).toBeDefined();
    expect(labelContainer.childNodes.length).toBe(1);
  });

  it('Should render rating', async () => {
    const { container } = render(
      <ProductList
        list={[{ ...product, rating_count: 3 }]}
        totalPages={10}
        currentPage={1}
        visibleFields={[{ prop: 'rating_count' }]}
      />
    );
    const filledStars = container.querySelectorAll('.Sui-Rating--filled');
    const emptyStars = container.querySelectorAll('.Sui-Rating--empty');

    expect(filledStars.length).toBe(3);
    expect(emptyStars.length).toBe(2);
  });

  it('Should render list result items with custon link element', async () => {
    const customLinkTestId = 'custom-link';
    const { getByText, getByTestId } = render(
      <ProductList
        list={[{ ...product, url: 'http://test.com' }]}
        totalPages={10}
        currentPage={1}
        linkEl={({ children }) => (
          <div data-testid={customLinkTestId}>{children}</div>
        )}
      />
    );

    expect(getByTestId(customLinkTestId)).toBeDefined();
    expect(getByText(product.title)).toBeDefined();
    expect(getByText(toCurrency(product.price))).toBeDefined();
    expect(getByText(toCurrency(product.sale))).toBeDefined();
  });

  it('Should render no result custom component', async () => {
    const noResultsMessagge = 'My no results test message';
    const { getByText } = render(
      <ProductList
        list={[]}
        totalPages={0}
        currentPage={0}
        renderNoResults={() => <h1>{noResultsMessagge}</h1>}
      />
    );

    expect(getByText(noResultsMessagge)).toBeDefined();
  });
});
