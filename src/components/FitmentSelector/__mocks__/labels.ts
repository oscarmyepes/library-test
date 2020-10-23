export const createMockedLabel = (
  labelName: string | number,
  index: number
) => ({
  id: index + 1,
  name: `${labelName}`,
  priority: index + 1,
});

export const createLabels = () =>
  ['Year', 'Make', 'Model', 'Submodel', 'Engine'].map(createMockedLabel);

export const createYearLabelData = () =>
  [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014].map(createMockedLabel);

export const createMakeLabelData = () =>
  ['Acura', 'Audi', 'BMW', 'Honda', 'Mercedes', 'Porsche', 'Volkswagen'].map(
    createMockedLabel
  );

export const createModelLabelData = () =>
  ['C-Class', 'TLX', '718', '911'].map(createMockedLabel);

export const createSubModelLabelData = () =>
  ['Boxter', 'Caiman', 'S', 'L'].map(createMockedLabel);

export const createEngineLabelData = () =>
  ['1.0', '2.0', '3.0', '3.0T'].map(createMockedLabel);
