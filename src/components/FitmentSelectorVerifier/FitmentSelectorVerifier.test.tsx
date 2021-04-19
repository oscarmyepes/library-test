import { fireEvent, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React from 'react';
import { env } from '../../config';
import {
  MAKERS,
  mockApiCalls,
  MODELS,
  SUB_MODELS,
  YEARS,
} from '../FitmentSelectorWrapper/__mocks__/apiCalls';
import FitmentSelectorVerifier from './FitmentSelectorVerifier';

describe('FitmentSelectorVerifier', () => {
  const DEFAULT_ID = 1;

  beforeEach(() => {
    mockApiCalls();
  });

  afterEach(() => fetchMock.reset());

  it('Should show error alert when all mandatory values are not sent in selectedValues property', async () => {
    const { findByText } = render(
      <FitmentSelectorVerifier
        alertErrorTitle="Error"
        selectedValues={{
          Make: DEFAULT_ID,
          Model: DEFAULT_ID,
          Year: DEFAULT_ID,
        }}
      />
    );

    const selectedYear = YEARS.find((item) => item.id === DEFAULT_ID).name;
    const selectedMake = MAKERS.find((item) => item.id === DEFAULT_ID).name;
    const selectedModel = MODELS.find((item) => item.id === DEFAULT_ID).name;

    await findByText('Error');
    await findByText(`${selectedYear} ${selectedMake} ${selectedModel}`);
  });

  it('Should show error alert when selected values contains wrong ids', async () => {
    const wrongId = DEFAULT_ID + 100;
    fetchMock.get(
      `${env.API_URL}/fitment/submodel?year=1&make=1&model=${wrongId}`,
      SUB_MODELS,
      { delay: 0 }
    );
    const { findByText } = render(
      <FitmentSelectorVerifier
        alertErrorTitle="Error"
        selectedValues={{
          Make: DEFAULT_ID,
          Model: wrongId,
          Year: DEFAULT_ID,
        }}
      />
    );

    await findByText('Error');
    await findByText(
      'There is an error on your Fitment selection, please try again.'
    );
  });

  it('Should show success message when selected values are valid', async () => {
    const { findByText } = render(
      <FitmentSelectorVerifier
        alertSuccessTitle="Success"
        selectedValues={{
          Make: DEFAULT_ID,
          Model: DEFAULT_ID,
          Submodel: DEFAULT_ID,
          Year: DEFAULT_ID,
        }}
      />
    );

    const selectedYear = YEARS.find((item) => item.id === DEFAULT_ID).name;
    const selectedMake = MAKERS.find((item) => item.id === DEFAULT_ID).name;
    const selectedModel = MODELS.find((item) => item.id === DEFAULT_ID).name;
    const selectedSubmodel = SUB_MODELS.find((item) => item.id === DEFAULT_ID)
      .name;

    await findByText('Success');
    await findByText(
      `${selectedYear} ${selectedMake} ${selectedModel} ${selectedSubmodel}`
    );
  });

  it('Should reset values when user clicks Clear button and not show Error alert', async () => {
    const { container, findByText, getByTestId } = render(
      <FitmentSelectorVerifier
        alertSuccessTitle="Success"
        alertErrorTitle="Error"
        alertButtonText="Change vehicle"
        selectedValues={{
          Engine: DEFAULT_ID,
          Make: DEFAULT_ID,
          Model: DEFAULT_ID,
          Submodel: DEFAULT_ID,
          Year: DEFAULT_ID,
        }}
        clearButtonText="Clear"
        autocommit={false}
      />
    );
    await waitFor(() => expect(fetchMock.calls()).toHaveLength(8));

    const showFitmentBtn = await findByText('Change vehicle');
    showFitmentBtn.click();

    const clearBtn = await findByText('Clear');
    clearBtn.click();

    expect(container.querySelector('.Sui-Alert--root')).toHaveStyle({
      display: 'none',
    });

    await waitFor(() =>
      expect(getByTestId('fitment-verifier-selectors').style.display).toBe('')
    );
  });

  it('Should show alert after executing Fitment submit function', async () => {
    const { container, getByTestId, findByText, findAllByRole } = render(
      <FitmentSelectorVerifier
        alertSuccessTitle="Success"
        alertErrorTitle="Error"
        alertButtonText="Change vehicle"
        selectedValues={{
          Engine: DEFAULT_ID,
          Make: DEFAULT_ID,
          Model: DEFAULT_ID,
          Submodel: DEFAULT_ID,
          Year: DEFAULT_ID,
        }}
        clearButtonText="Clear"
        searchButtonText="Search"
        autocommit={false}
      />
    );
    await waitFor(() => expect(fetchMock.calls()).toHaveLength(8));

    await waitFor(() =>
      expect(
        (container.querySelector('.Sui-Alert--root') as HTMLInputElement).style
          .display
      ).toBe('')
    );
    expect(getByTestId('fitment-verifier-selectors')).toHaveStyle({
      display: 'none',
    });

    const showFitmentBtn = await findByText('Change vehicle');
    showFitmentBtn.click();

    await waitFor(() =>
      expect(container.querySelector('.Sui-Alert--root')).toHaveStyle({
        display: 'none',
      })
    );
    expect(getByTestId('fitment-verifier-selectors').style.display).toBe('');

    const selects = await findAllByRole('listbox');
    fireEvent.change(selects[5], { target: { value: DEFAULT_ID } });

    const searchFitmentBtn = await findByText('Search');
    searchFitmentBtn.click();

    await waitFor(() =>
      expect(
        (container.querySelector('.Sui-Alert--root') as HTMLInputElement).style
          .display
      ).toBe('')
    );
    expect(getByTestId('fitment-verifier-selectors')).toHaveStyle({
      display: 'none',
    });
  });
});
