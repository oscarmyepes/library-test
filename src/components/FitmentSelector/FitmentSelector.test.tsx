import { fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { delay } from '../../__mocks__/utils';
import {
  createLabels,
  createMakeLabelData,
  createModelLabelData,
  createOptionalLabels,
  createSubModelLabelData,
  createYearLabelData,
} from '../FitmentSelectorWrapper/__mocks__/labels';
import FitmentSelector from './FitmentSelector';
import { FitmentSelectorProps } from './models';

describe('FitmentSelector', () => {
  const LABELS: FitmentSelectorProps['labels'] = createLabels();
  const OPTIONAL_LABELS: FitmentSelectorProps['labels'] = createOptionalLabels();

  const YEARS = createYearLabelData();
  const MAKERS = createMakeLabelData();
  const MODELS = createModelLabelData();
  const SUBMODELS = createSubModelLabelData();

  it('Should render received label', async () => {
    const { findAllByRole } = render(
      <FitmentSelector
        searchButtonText="Ok"
        clearButtonText="Clear"
        labels={LABELS}
        labelsData={{ [LABELS[0].name]: [{ id: 1, name: '2021' }] }}
        selectedValues={{}}
        onChange={() => null}
        onSubmit={() => null}
      />
    );

    const selects = await findAllByRole('listbox');
    expect(selects.length).toBe(LABELS.length);
  });

  it('Should render selects with selectedValues and call submit function', async () => {
    const data = {
      [LABELS[0].name]: YEARS,
      [LABELS[1].name]: MAKERS,
      [LABELS[2].name]: MODELS,
      [LABELS[3].name]: SUBMODELS,
    };
    const selectedValues = {
      [LABELS[0].name]: YEARS[0].id,
      [LABELS[1].name]: MAKERS[2].id,
      [LABELS[2].name]: MODELS[3].id,
    };

    const onSubmit = jest.fn();

    const { findAllByRole, findByText } = render(
      <FitmentSelector
        searchButtonText="Ok"
        clearButtonText="Clear"
        labels={LABELS}
        labelsData={data}
        selectedValues={selectedValues}
        onChange={() => null}
        onSubmit={onSubmit}
      />
    );
    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    expect(selects[0].value).toEqual(String(selectedValues[LABELS[0].name]));
    expect(selects[1].value).toEqual(String(selectedValues[LABELS[1].name]));
    expect(selects[2].value).toEqual(String(selectedValues[LABELS[2].name]));

    const submitBtn = await findByText('Ok');
    // Submit button should be disabled until user selects all labels
    expect(submitBtn).toBeDisabled();

    fireEvent.change(selects[3], { target: { value: 1 } });
    expect(submitBtn).toBeEnabled();
    submitBtn.click();
    expect(onSubmit).toHaveBeenCalledWith({
      ...selectedValues,
      [LABELS[3].name]: String(SUBMODELS[0].id),
    });
  });

  it('Should validate selectedValues', async () => {
    const data = {
      [LABELS[0].name]: YEARS,
      [LABELS[1].name]: MAKERS,
      [LABELS[2].name]: MODELS,
    };
    const selectedValues = {
      [LABELS[0].name]: YEARS[0].id,
      [LABELS[1].name]: 'Worng id',
      [LABELS[2].name]: MODELS[3].id,
    };

    const onSubmit = jest.fn();

    const { findAllByRole } = render(
      <FitmentSelector
        labels={LABELS}
        labelsData={data}
        selectedValues={selectedValues}
        onSubmit={onSubmit}
      />
    );
    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    expect(selects[0].value).toEqual(String(selectedValues[LABELS[0].name]));
    /*
      We are sending an Id that does not exists for the second select, 
      so we expect the second and third selects to don't have a selected value.
    */
    expect(selects[1].value).toEqual('');
    expect(selects[2].value).toEqual('');
    expect(selects[1]).toBeEnabled();
    expect(selects[2]).toBeDisabled();
  });

  it('Should call onChange with selected values', async () => {
    const data = {
      [LABELS[0].name]: YEARS,
    };
    const onChange = jest.fn();

    const { findAllByRole } = render(
      <FitmentSelector
        labels={LABELS}
        labelsData={data}
        selectedValues={{}}
        onChange={onChange}
        onSubmit={() => null}
      />
    );
    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    fireEvent.change(selects[0], { target: { value: 1 } });

    expect(onChange).toHaveBeenCalledWith(LABELS[0].name, {
      [LABELS[0].name]: '1',
    });
  });

  it('Should call onChange with cleared data when user changes one of the previous selects', async () => {
    const data = {
      [LABELS[0].name]: YEARS,
      [LABELS[1].name]: MAKERS,
      [LABELS[2].name]: MODELS,
    };
    const selectedValues = {
      [LABELS[0].name]: YEARS[0].id,
      [LABELS[1].name]: MAKERS[2].id,
      [LABELS[2].name]: MODELS[3].id,
    };
    const onChange = jest.fn();

    const { findAllByRole } = render(
      <FitmentSelector
        labels={LABELS}
        labelsData={data}
        selectedValues={selectedValues}
        onChange={onChange}
        onSubmit={() => null}
      />
    );

    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    fireEvent.change(selects[0], { target: { value: YEARS[0].id } });

    expect(onChange).toHaveBeenCalledWith(LABELS[0].name, {
      [LABELS[0].name]: '1',
    });
  });

  it('Should call submit automatically when autocommit is TRUE', async () => {
    const onSubmit = jest.fn();
    const labels = LABELS.slice(0, 3);
    const data = {
      [LABELS[0].name]: YEARS,
      [LABELS[1].name]: MAKERS,
      [LABELS[2].name]: MODELS,
    };

    const selectedValues = {
      [LABELS[0].name]: YEARS[0].id,
      [LABELS[1].name]: MAKERS[2].id,
    };
    const lastLabelIndex = labels.length - 1;

    const { findAllByRole } = render(
      <FitmentSelector
        labels={labels}
        labelsData={data}
        selectedValues={selectedValues}
        onChange={() => null}
        onSubmit={onSubmit}
        autocommit
        autocommitDelay={10}
      />
    );
    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    fireEvent.change(selects[lastLabelIndex], {
      target: { value: MODELS[0].id },
    });

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...selectedValues,
        [LABELS[lastLabelIndex].name]: String(MODELS[0].id),
      })
    );
  });

  it('Should NOT call submit automatically when user changes a previous select value', async () => {
    const onSubmit = jest.fn();
    const labels = LABELS.slice(0, 3);
    const data = {
      [LABELS[0].name]: YEARS,
      [LABELS[1].name]: MAKERS,
      [LABELS[2].name]: MODELS,
    };

    const selectedValues = {
      [LABELS[0].name]: YEARS[0].id,
      [LABELS[1].name]: MAKERS[2].id,
    };

    const { findAllByRole } = render(
      <FitmentSelector
        labels={labels}
        labelsData={data}
        selectedValues={selectedValues}
        onChange={() => null}
        onSubmit={onSubmit}
        autocommit
        autocommitDelay={10}
      />
    );
    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    fireEvent.change(selects[labels.length - 1], {
      target: { value: MODELS[0].id },
    });
    await delay(5);
    fireEvent.change(selects[labels.length - 2], {
      target: { value: MAKERS[0].id },
    });
    await delay(12);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(0));
  });

  it('Should show optional labels when the last label has a value an there are optional labels data', async () => {
    const labels = LABELS.slice(0, 3);
    const data = {
      [LABELS[0].name]: YEARS,
      [LABELS[1].name]: MAKERS,
      [LABELS[2].name]: MODELS,
    };

    const selectedValues = {
      [LABELS[0].name]: YEARS[0].id,
      [LABELS[1].name]: MAKERS[2].id,
    };
    const { findAllByRole, findByText } = render(
      <FitmentSelector
        labels={labels}
        optionalLabels={OPTIONAL_LABELS}
        labelsData={data}
        selectedValues={selectedValues}
        onChange={() => null}
        onSubmit={() => null}
        autocommit
        autocommitDelay={10}
        optionalLabelsTitle="I am the optional labels section"
      />
    );
    const selects = (await findAllByRole('listbox')) as HTMLSelectElement[];

    expect(selects).toHaveLength(labels.length);

    fireEvent.change(selects[labels.length - 1], {
      target: { value: MODELS[0].id },
    });

    const allSelects = (await findAllByRole('listbox')) as HTMLSelectElement[];
    expect(allSelects).toHaveLength(labels.length + OPTIONAL_LABELS.length);

    await findByText('I am the optional labels section');
  });
});
