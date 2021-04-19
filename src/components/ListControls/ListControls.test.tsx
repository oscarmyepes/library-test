import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import ListControls from './ListControls';

describe('ListControls', () => {
  it('Should render custom items per page list and call onItemsPerPageChange function', async () => {
    const onLayoutChange = jest.fn();
    const onItemsPerPageChange = jest.fn();
    const itemsPerPageOptions = [12, 24, 48, 60, 96];
    const indexOptionToSelect = 1;
    const { findAllByRole, findByRole } = render(
      <ListControls
        orientation="horizontal"
        onLayoutChange={onLayoutChange}
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPage={10}
        itemsPerPageOptions={[12, 24, 48, 60, 96]}
      />
    );
    const select = await findByRole('listbox');
    const options = (await findAllByRole('option')) as HTMLOptionElement[];
    options.forEach((option, index) =>
      expect(option.value).toBe(String(itemsPerPageOptions[index]))
    );

    fireEvent.change(select, {
      target: { value: String(itemsPerPageOptions[indexOptionToSelect]) },
    });

    expect(onItemsPerPageChange).toHaveBeenLastCalledWith(
      itemsPerPageOptions[indexOptionToSelect]
    );
  });

  it('Should render Sort options and call onSortChange', async () => {
    const onLayoutChange = jest.fn();
    const onItemsPerPageChange = jest.fn();
    const onSortChange = jest.fn();
    const initialSelectedSort = 3;
    const { findAllByRole } = render(
      <ListControls
        orientation="horizontal"
        onLayoutChange={onLayoutChange}
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPage={10}
        itemsPerPageOptions={[12, 24, 48, 60, 96]}
        sortOptions={[
          { id: 0, label: '-' },
          { id: 1, label: 'Title A-Z' },
          { id: 2, label: 'Title Z-A' },
          { id: 3, label: 'Date: New to Old' },
          { id: 4, label: 'Date: Old to New' },
        ]}
        onSortChange={onSortChange}
        selectedSort={initialSelectedSort}
      />
    );

    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    expect(selects[0].value).toBe(String(initialSelectedSort));

    fireEvent.change(selects[0], {
      target: { value: 1 },
    });

    expect(onSortChange).toHaveBeenLastCalledWith('1');
  });
});
