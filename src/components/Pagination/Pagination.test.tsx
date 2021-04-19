import { render } from '@testing-library/react';
import * as React from 'react';
import Pagination from './Pagination';

describe('Pagination', () => {
  const renderPagination = ({
    totalPages,
    currentPage = 1,
    onChangePage = () => null,
  }) =>
    render(
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    );

  it('Should show all page numbers when totalPages <= limit', () => {
    const expected = ['', 1, 2, 3, 4, 5, 6, 7, ''];
    const { getAllByRole } = renderPagination({ totalPages: 7 });
    const pageButtons = getAllByRole('button');

    pageButtons.forEach((button: HTMLButtonElement, index: number) => {
      if (index > 0 && index < expected.length - 1) {
        expect(button.innerHTML).toEqual(String(expected[index]));
      }
    });
  });

  it('Should show 3 dots before the last page number', () => {
    const expected = ['', 1, 2, 3, 4, 5, '...', 10, ''];
    const { getAllByRole } = renderPagination({ totalPages: 10 });
    const pageButtons = getAllByRole('button');

    pageButtons.forEach((button: HTMLButtonElement, index: number) => {
      if (index > 0 && index < expected.length - 1) {
        expect(button.innerHTML).toEqual(String(expected[index]));
      }
    });
  });

  it('Should show 3 dots after first page and before the last page number', () => {
    const expected = ['', 1, '...', 4, 5, 6, '...', 10, ''];
    const { getAllByRole } = renderPagination({
      currentPage: 5,
      totalPages: 10,
    });
    const pageButtons = getAllByRole('button');

    pageButtons.forEach((button: HTMLButtonElement, index: number) => {
      if (index > 0 && index < expected.length - 1) {
        expect(button.innerHTML).toEqual(String(expected[index]));
      }
    });
  });

  it('Should show 3 dots after first page when currentPage is close to last page', () => {
    const expected = ['', 1, '...', 6, 7, 8, 9, 10, ''];
    const { getAllByRole } = renderPagination({
      currentPage: 7,
      totalPages: 10,
    });
    const pageButtons = getAllByRole('button');

    pageButtons.forEach((button: HTMLButtonElement, index: number) => {
      if (index > 0 && index < expected.length - 1) {
        expect(button.innerHTML).toEqual(String(expected[index]));
      }
    });
  });

  it('Should call onChangePage after clicking a page number', async () => {
    const onChangePage = jest.fn();
    const pageToSelect = 8;
    const { getByText } = renderPagination({
      currentPage: 7,
      onChangePage,
      totalPages: 10,
    });
    const pageToClick = getByText(String(pageToSelect));
    pageToClick.click();

    expect(onChangePage).toHaveBeenCalledWith(pageToSelect);
  });

  it('Should call onChangePage with current page - 1 when clicking angle left icon', () => {
    const onChangePage = jest.fn();
    const currentPage = 6;
    const { getAllByRole } = renderPagination({
      currentPage,
      onChangePage,
      totalPages: 10,
    });

    const pageButtons = getAllByRole('button');
    // Click left arrow icon
    pageButtons[0].click();

    expect(onChangePage).toHaveBeenCalledWith(currentPage - 1);
  });

  it('Should call onChangePage with current page + 1 when clicking angle right icon', () => {
    const onChangePage = jest.fn();
    const currentPage = 6;
    const { getAllByRole } = renderPagination({
      currentPage,
      onChangePage,
      totalPages: 10,
    });

    const pageButtons = getAllByRole('button');
    // Click right arrow icon
    pageButtons[pageButtons.length - 1].click();

    expect(onChangePage).toHaveBeenCalledWith(currentPage + 1);
  });
});
