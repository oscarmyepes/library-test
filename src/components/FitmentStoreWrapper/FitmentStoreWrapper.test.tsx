import { render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import { env } from '../../config';
import { FITMENT_SELECTOR_STORAGE_KEY } from '../../utils/constants';
import { FitmentSelectorStore } from '../FitmentSelector/models';
import { mockApiCalls } from '../FitmentSelectorWrapper/__mocks__/apiCalls';
import { getFitmentLabel } from './FitmentStorePopover';
import FitmentStoreWrapper from './FitmentStoreWrapper';
import { FitmentStoreWrapperProps } from './models';

describe('FitmentStoreWrapper', () => {
  const STORED_FITMENTS: FitmentSelectorStore[][] = [
    [
      {
        label: { id: 'Year', name: 'Year', priority: 1 },
        value: { id: '2020', name: '2020', priority: 1 },
      },
      {
        label: { id: 'Make', name: 'Make', priority: 2 },
        value: { id: 'ACURA', name: 'ACURA', priority: 1 },
      },
      {
        label: { id: 'Model', name: 'Model', priority: 3 },
        value: { id: 'CL', name: 'CL', priority: 1 },
      },
      {
        label: { id: 'Submodel', name: 'Submodel', priority: 4 },
        value: { id: 'BASE', name: 'BASE', priority: 1 },
      },
    ],
    [
      {
        label: { id: 'Year', name: 'Year', priority: 1 },
        value: { id: '2020', name: '2020', priority: 1 },
      },
      {
        label: { id: 'Make', name: 'Make', priority: 2 },
        value: { id: 'ACURA', name: 'ACURA', priority: 1 },
      },
      {
        label: { id: 'Model', name: 'Model', priority: 3 },
        value: { id: 'ILX', name: 'ILX', priority: 2 },
      },
      {
        label: { id: 'Submodel', name: 'Submodel', priority: 4 },
        value: { id: 'BASE', name: 'BASE', priority: 1 },
      },
    ],
  ];

  afterEach(() => {
    fetchMock.reset();
    window.localStorage.setItem(FITMENT_SELECTOR_STORAGE_KEY, '');
  });

  describe('When using native selector', () => {
    it('Should render with custom texts', () => {
      const htmlSectiontext =
        'I am a custom section when tehre are no saved fitments';
      const props: Partial<FitmentStoreWrapperProps> = {
        addButtonText: 'Add new fitment test',
        clearButtontext: 'Remove all test fitments',
        htmlSection: function Section() {
          return <div>{htmlSectiontext}</div>;
        },
        primaryTitle: 'Primary title',
        sectionTitle: 'Popover title',
        subtitle: 'Subtitle',
      };
      const { getByText, queryByText } = render(
        <FitmentStoreWrapper {...props} />
      );

      expect(getByText(props.primaryTitle)).toBeInTheDocument();
      expect(getByText(props.subtitle)).toBeInTheDocument();
      expect(getByText(htmlSectiontext)).toBeInTheDocument();
      expect(getByText(props.addButtonText)).toBeInTheDocument();
      expect(queryByText(props.sectionTitle)).not.toBeInTheDocument();
      expect(queryByText(props.clearButtontext)).not.toBeInTheDocument();
    });

    it('Should render list of stored fitments and remove one', async () => {
      window.localStorage.setItem(
        FITMENT_SELECTOR_STORAGE_KEY,
        JSON.stringify(STORED_FITMENTS)
      );

      const { findByText, getAllByLabelText, getAllByRole } = render(
        <FitmentStoreWrapper />
      );

      await findByText(getFitmentLabel(STORED_FITMENTS[0]));
      await findByText(getFitmentLabel(STORED_FITMENTS[1]));
      expect(getAllByRole('listitem')).toHaveLength(STORED_FITMENTS.length);

      const removeFitmentBtn = getAllByLabelText('remove-fitment');
      removeFitmentBtn[0].click();
      expect(getAllByRole('listitem')).toHaveLength(1);
      expect(window.localStorage.getItem(FITMENT_SELECTOR_STORAGE_KEY)).toBe(
        JSON.stringify([STORED_FITMENTS[1]])
      );
    });

    it('Should remove all fitments', async () => {
      window.localStorage.setItem(
        FITMENT_SELECTOR_STORAGE_KEY,
        JSON.stringify(STORED_FITMENTS)
      );
      const { findByText, queryAllByRole } = render(
        <FitmentStoreWrapper clearButtontext="Clear all" />
      );
      expect(queryAllByRole('listitem')).toHaveLength(STORED_FITMENTS.length);
      const clearBtn = await findByText('Clear all');
      clearBtn.click();
      expect(queryAllByRole('listitem')).toHaveLength(0);
      expect(window.localStorage.getItem(FITMENT_SELECTOR_STORAGE_KEY)).toBe(
        '[]'
      );
    });

    it('Should show Select fitment modal', async () => {
      mockApiCalls();
      const { getByText, getAllByRole } = render(
        <FitmentStoreWrapper addButtonText="Add new fitment" />
      );
      const triggerModalBtn = getByText('Add new fitment');
      triggerModalBtn.click();
      expect(getAllByRole('presentation')).toHaveLength(2);
      expect(getByText('SELECT YOUR FITMENT')).toBeInTheDocument();
      await waitFor(() => expect(fetchMock.calls()).toHaveLength(2));
      expect(fetchMock.lastUrl()).toBe(`${env.API_URL}/fitment/year`);
    });
  });
});
