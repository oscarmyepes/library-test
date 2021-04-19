import { fireEvent, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import SpecificationSearch from './SpecificationSearch';

describe('SpecificationSearch', () => {
  const DATA: [string, string][] = [
    ['ABCDE', 'AB-12345'],
    ['Brand', 'Lamborghini'],
    ['Jklmz', 'New'],
  ];

  afterEach(() => {
    fetchMock.reset();
    jest.clearAllMocks();
  });

  it('Should render matched suggestions', async () => {
    const { getByLabelText, getByText, getAllByRole } = render(
      <SpecificationSearch data={DATA} />
    );

    const input = getByLabelText('search-match-input');

    fireEvent.change(input, { target: { value: 'A' } });
    await waitFor(() => expect(getAllByRole('row')).toHaveLength(2));

    fireEvent.change(input, { target: { value: 'AB' } });
    await waitFor(() => expect(getByText('ABCDE')).toBeInTheDocument());
    await waitFor(() => expect(getByText('AB-12345')).toBeInTheDocument());
    await waitFor(() => expect(getAllByRole('row')).toHaveLength(1));

    fireEvent.change(input, { target: { value: 'Lambo' } });
    await waitFor(() => expect(getByText('Brand')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Lamborghini')).toBeInTheDocument());
    await waitFor(() => expect(getAllByRole('row')).toHaveLength(1));
  });
});
