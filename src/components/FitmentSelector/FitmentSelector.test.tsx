import { fireEvent, render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import FitmentSelector from './FitmentSelector';
import { CustomSelect } from './models';
import {
  createLabels,
  createMakeLabelData,
  createModelLabelData,
  createSubModelLabelData,
  createYearLabelData,
} from './__mocks__/labels';

const LABELS = createLabels();
const YEARS = createYearLabelData();
const MAKERS = createMakeLabelData();
const MODELS = createModelLabelData();
const SUB_MODELS = createSubModelLabelData();

/*
  Note: This component makes an API call on first render, for that reason we have to use
  waitFor and act to wait for async actions to finish.
*/
describe('FitmentSelector', () => {
  beforeAll(() => {
    fetchMock.get(`${process.env.API_URL}/labels`, LABELS);

    fetchMock.get(`${process.env.API_URL}/Year`, YEARS, {
      delay: 0,
    });
    fetchMock.get(`${process.env.API_URL}/Make`, MAKERS, {
      delay: 0,
    });
    fetchMock.get(`${process.env.API_URL}/Model`, MODELS, { delay: 0 });
    fetchMock.get(`${process.env.API_URL}/Submodel`, SUB_MODELS, { delay: 0 });
  });

  afterAll(() => fetchMock.reset());

  describe('When using native selector', () => {
    it('Should render FitmentSelector with custom button text', async () => {
      const { getByText, findAllByRole } = render(
        <FitmentSelector searchButtonText="Ok" clearButtonText="Clear" />
      );

      const okButton = getByText('Ok');
      // Need to wait the render to prevent "Can't perform a React state update on an unmounted component" warning
      await findAllByRole('listbox');
      waitFor(() => expect(getByText('Ok')).toBeDefined());
      expect((okButton as HTMLInputElement).disabled).toBeTruthy();
      expect(getByText('Clear')).toBeDefined();
    });

    it('Should disable from second select to last one on first render', async () => {
      const { findAllByRole } = render(<FitmentSelector />);
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
    });

    it('Should enable second select when first select has selected value', async () => {
      const { findAllByRole } = render(<FitmentSelector />);
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 1);
    });

    it('Should enable third select when first and second select have selected value', async () => {
      const { findAllByRole } = render(<FitmentSelector />);
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
      await act(async () => {
        fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      });
      await checkDisabledFields(fitmentSelector, 1);
      await act(async () => {
        fireEvent.change(fitmentSelector[1], { target: { value: 1 } });
      });
      await checkDisabledFields(fitmentSelector, 2);
    });

    it('Should call onChange on every select change', async () => {
      const onChange = jest.fn();
      const { findAllByRole } = render(<FitmentSelector onChange={onChange} />);
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];

      await checkDisabledFields(fitmentSelector, 0);
      await act(async () => {
        fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      });
      await checkDisabledFields(fitmentSelector, 1);
      await waitFor(() =>
        expect(onChange).toHaveBeenCalledWith(
          LABELS.map((label, index) => ({
            ...label,
            value: index === 0 ? getLabelValue(label.name) : null,
          }))
        )
      );
      await act(async () => {
        fireEvent.change(fitmentSelector[1], { target: { value: 1 } });
      });
      await waitFor(() =>
        expect(onChange).toHaveBeenCalledWith(
          LABELS.map((label, index) => ({
            ...label,
            value: index <= 1 ? getLabelValue(label.name) : null,
          }))
        )
      );
      await waitFor(() => expect(fitmentSelector[2].disabled).toBeFalsy());
      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));
    });

    it('Should enable Submit button when values are selected', async () => {
      const onSubmit = jest.fn();
      const { findAllByRole, findByText } = render(
        <FitmentSelector onSubmit={onSubmit} searchButtonText="Search" />
      );
      const searchButton = await findByText('Search');
      expect((searchButton as HTMLInputElement).disabled).toBeTruthy();

      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];
      await checkDisabledFields(fitmentSelector, 0);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await checkDisabledFields(fitmentSelector, 1);

      expect((searchButton as HTMLInputElement).disabled).toBeFalsy();
      fireEvent.click(searchButton);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('Should clear selection', async () => {
      const { findAllByRole, findByText } = render(
        <FitmentSelector clearButtonText="Clear" />
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
    });

    it('Should set vertical class when orientation is vertical', async () => {
      const { container, findAllByRole } = render(
        <FitmentSelector orientation="vertical" styled={true} />
      );
      const fitmentSelector = (await findAllByRole(
        'listbox'
      )) as HTMLInputElement[];
      expect(container.firstElementChild.className).toContain('vertical');
      fitmentSelector.forEach((_, index) => {
        expect(container.firstElementChild.children[index].className).toContain(
          'StyledSearchBtnVertical'
        );
      });
    });
  });

  describe('When using Custom selector', () => {
    it('Should render custom select and call internal onChange', async () => {
      const onChange = jest.fn();
      const { findAllByTestId } = render(
        <FitmentSelector
          components={{
            select: function CustomSelect(props: CustomSelect) {
              return (
                <select
                  {...props}
                  data-testid="custom-select"
                  onChange={(e) => {
                    onChange(e);
                    props.onChange(e.currentTarget.value);
                  }}
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

      const fitmentSelector = (await findAllByTestId(
        'custom-select'
      )) as HTMLInputElement[];
      expect(fitmentSelector).toHaveLength(LABELS.length);
      fireEvent.change(fitmentSelector[0], { target: { value: 1 } });
      await waitFor(() =>
        expect(fitmentSelector[1].childNodes).toHaveLength(MAKERS.length)
      );

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});

function getLabelValue(label) {
  switch (label) {
    case 'Year':
      return YEARS[0];
    case 'Make':
      return MAKERS[0];
    default:
      return null;
  }
}

async function checkDisabledFields(
  fitmentSelector: HTMLInputElement[],
  indexLastEnabled: number
) {
  await waitFor(() =>
    fitmentSelector.map((selector, index) =>
      index <= indexLastEnabled
        ? expect(selector.disabled).toBeFalsy()
        : expect(selector.disabled).toBeTruthy()
    )
  );
}
