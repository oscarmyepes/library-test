import { fireEvent, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import { env } from '../../config';
import { CustomSelect } from '../FitmentSelector/models';
import FitmentSelectorWrapper, { PRODUCT_KEY } from './FitmentSelectorWrapper';
import { LABELS, MAKERS, mockApiCalls, YEARS } from './__mocks__/apiCalls';

describe('FitmentSelectorWrapper', () => {
  beforeEach(() => {
    mockApiCalls();
  });

  afterEach(() => fetchMock.reset());

  describe('When using native selector', () => {
    it('Should render FitmentSelectorWrapper with custom button text', async () => {
      const { findByText, findAllByRole } = render(
        <FitmentSelectorWrapper searchButtonText="Ok" clearButtonText="Clear" />
      );

      const okButton = await findByText('Ok');
      // Need to wait the render to prevent "Can't perform a React state update on an unmounted component" warning
      await findAllByRole('listbox');
      expect(okButton as HTMLInputElement).toBeDisabled();
      expect(await findByText('Clear')).toBeDefined();
    });

    it('Should disable from second select to last one on first render', async () => {
      const { findAllByRole } = render(<FitmentSelectorWrapper />);
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
    });

    it('Should enable second select when first select has selected value', async () => {
      const { findAllByRole } = render(<FitmentSelectorWrapper />);
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 1);
    });

    it('Should enable third select when first and second select have selected value', async () => {
      const { findAllByRole } = render(<FitmentSelectorWrapper />);
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 1);
      fireEvent.change(fitmentSelector[1], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 2);
    });

    it('Should call onChange on every select change', async () => {
      const onChange = jest.fn();
      const { findAllByRole } = render(
        <FitmentSelectorWrapper onChange={onChange} />
      );
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 1);
      await waitFor(() =>
        expect(onChange).toHaveBeenCalledWith(LABELS[0].name, {
          [LABELS[0].name]: '1',
        })
      );
      fireEvent.change(fitmentSelector[1], { target: { value: 1 } });
      await waitFor(() =>
        expect(onChange).toHaveBeenCalledWith(LABELS[1].name, {
          [LABELS[0].name]: '1',
          [LABELS[1].name]: '1',
        })
      );
      await waitFor(() => expect(fitmentSelector[2]).toBeEnabled());
      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));
    });

    it('Should enable Submit button when all values are selected', async () => {
      const onSubmit = jest.fn();
      const { findAllByRole, findByText } = render(
        <FitmentSelectorWrapper onSubmit={onSubmit} searchButtonText="Search" />
      );
      const searchButton = await findByText('Search');
      expect(searchButton as HTMLInputElement).toBeDisabled();

      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];
      await checkDisabledFields(fitmentSelector, 0);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 1);
      expect(searchButton as HTMLInputElement).toBeDisabled();
      fireEvent.change(fitmentSelector[1], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 2);
      expect(searchButton as HTMLInputElement).toBeDisabled();
      fireEvent.change(fitmentSelector[2], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 3);
      expect(searchButton as HTMLInputElement).toBeDisabled();
      fireEvent.change(fitmentSelector[3], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 4);
      expect(searchButton as HTMLInputElement).toBeEnabled();

      fireEvent.click(searchButton);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('Should clear selection', async () => {
      const onChange = jest.fn();
      const { findAllByRole, findByText } = render(
        <FitmentSelectorWrapper clearButtonText="Clear" onChange={onChange} />
      );

      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];
      await checkDisabledFields(fitmentSelector, 0);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 1);
      const clearButton = await findByText('Clear');
      fireEvent.click(clearButton);
      // After clear all selectors must be reseted having value === ''
      fitmentSelector.forEach((selector) => expect(selector.value).toBe(''));
      await checkDisabledFields(fitmentSelector, 0);
      expect(onChange).toHaveBeenCalledWith(null, null);
    });

    it('Should load data for selected values', async () => {
      const { findAllByRole } = render(
        <FitmentSelectorWrapper
          selectedValues={{ Make: 1, Model: 1, Submodel: 1, Year: 1 }}
        />
      );

      // Expect calls to load labels, optionalLabels years, make, model, submodel, engine
      await waitFor(() => expect(fetchMock.calls()).toHaveLength(7));
      expect(fetchMock.lastUrl()).toBe(
        `${env.API_URL}/fitment/engine?year=1&make=1&model=1&submodel=1`
      );

      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      expect(fitmentSelector).toHaveLength(6);
      expect(fitmentSelector[0].value).toBe('1');
      expect(fitmentSelector[1].value).toBe('1');
      expect(fitmentSelector[2].value).toBe('1');
      expect(fitmentSelector[3].value).toBe('1');
    });

    it('Should NOT call optional labels endpoint when filtering for specific product', async () => {
      const filter = { [PRODUCT_KEY]: 'prod' };
      mockApiCalls(filter);
      render(
        <FitmentSelectorWrapper
          selectedValues={{ Make: 1, Model: 1, Submodel: 1, Year: 1 }}
          filter={filter}
        />
      );
      // Expect calls to load labels years, make, model, submodel
      await waitFor(() => expect(fetchMock.calls()).toHaveLength(5));
    });

    it('Should set vertical class when orientation is vertical', async () => {
      const { container, findAllByRole } = render(
        <FitmentSelectorWrapper orientation="vertical" styled={true} />
      );
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];
      expect(container.firstElementChild.className).toContain('vertical');
      fitmentSelector.forEach((_, index) => {
        expect(
          container.firstElementChild.children[index].children[0].className
        ).toContain('styledSelectVertical');
      });
    });

    it('Should call onDataLoaded function when API response is received', async () => {
      const onDataLoaded = jest.fn();
      const { findAllByRole } = render(
        <FitmentSelectorWrapper onDataLoaded={onDataLoaded} />
      );

      await waitFor(() =>
        expect(onDataLoaded).toHaveBeenCalledWith(LABELS, [], {
          [LABELS[0].name]: YEARS,
        })
      );
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await waitFor(() =>
        expect(onDataLoaded).toHaveBeenCalledWith(LABELS, [], {
          [LABELS[0].name]: YEARS,
          [LABELS[1].name]: MAKERS,
        })
      );
    });

    it('Should call onSubmit when autocommit is TRUE and labels and optional labels were selected', async () => {
      const onSubmit = jest.fn();
      const { findAllByRole } = render(
        <FitmentSelectorWrapper
          onSubmit={onSubmit}
          autocommit
          autocommitDelay={10}
          selectedValues={{ Make: 1, Model: 1, Submodel: 1, Year: 1 }}
        />
      );

      await waitFor(() => expect(fetchMock.calls()).toHaveLength(7));

      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      fireEvent.change(fitmentSelector[4], { target: { value: 1 } });
      await waitFor(() => expect(fetchMock.calls()).toHaveLength(8));
      fireEvent.change(fitmentSelector[5], { target: { value: 1 } });
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    });
  });

  describe('When using Custom selector', () => {
    it('Should render custom select and call internal onChange', async () => {
      const onChange = jest.fn();
      const { findAllByRole } = render(
        <FitmentSelectorWrapper
          components={{
            select: function CustomSelect(props: CustomSelect) {
              return (
                <select
                  {...props}
                  onChange={(e) => {
                    onChange(e);
                    props.onChange(e.currentTarget.value);
                  }}
                  role="listbox"
                >
                  {(props.options || []).map((option) => (
                    <option
                      key={option.id}
                      role="option"
                      aria-selected={false}
                      value={option.id}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              );
            },
          }}
        />
      );

      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];
      expect(fitmentSelector).toHaveLength(LABELS.length);
      await waitFor(() =>
        expect(fitmentSelector[0].childNodes).toHaveLength(YEARS.length)
      );
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await waitFor(() =>
        expect(fitmentSelector[1].childNodes).toHaveLength(MAKERS.length)
      );

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});

async function checkDisabledFields(
  fitmentSelector: HTMLInputElement[],
  indexLastEnabled: number
) {
  await waitFor(() =>
    fitmentSelector.map((selector, index) =>
      index <= indexLastEnabled
        ? expect(selector).toBeEnabled()
        : expect(selector).toBeDisabled()
    )
  );
}
