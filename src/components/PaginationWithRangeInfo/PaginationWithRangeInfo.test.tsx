import { render } from '@testing-library/react';
import * as React from 'react';
import PaginationWithRangeInfo from './PaginationWithRangeInfo';

describe('PaginationWithRangeInfo', () => {
  const builComponent = ({
    totalItems,
    itemsPerPage,
    currentPage = 1,
    onChangePage = () => null,
  }) => (
    <PaginationWithRangeInfo
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onChangePage={onChangePage}
    />
  );

  it('Should show range with correct values', async () => {
    const { findByText, rerender } = render(
      builComponent({
        itemsPerPage: 5,
        totalItems: 2973,
      })
    );

    await findByText('Items 1-5 of 2973');

    rerender(
      builComponent({
        currentPage: 10,
        itemsPerPage: 5,
        totalItems: 2973,
      })
    );

    await findByText('Items 46-50 of 2973');
  });
});
