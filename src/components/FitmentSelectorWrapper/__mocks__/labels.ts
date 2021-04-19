import fetchMock from 'fetch-mock';
import { env } from '../../../config';

export const createMockedLabel = (
  labelName: string | number,
  index: number
) => ({
  id: index + 1,
  name: `${labelName}`,
});

export const createLabels = () =>
  ['Year', 'Make', 'Model', 'Submodel'].map(createMockedLabel);

export const createOptionalLabels = () =>
  ['Engine', 'Body'].map(createMockedLabel);

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

export const mockResponse = () => {
  const labels = createLabels();
  fetchMock.config.fallbackToNetwork = true;
  fetchMock
    .get(`${env.API_URL}/labels`, labels, {
      overwriteRoutes: true,
    })
    .get(`${env.API_URL}/${labels[0].name}`, createYearLabelData(), {
      overwriteRoutes: true,
    })
    .get(`${env.API_URL}/${labels[1].name}`, createMakeLabelData(), {
      overwriteRoutes: true,
    })
    .get(`${env.API_URL}/${labels[2].name}`, createModelLabelData(), {
      overwriteRoutes: true,
    })
    .get(`${env.API_URL}/${labels[3].name}`, createSubModelLabelData(), {
      overwriteRoutes: true,
    })
    .get(`${env.API_URL}/${labels[4].name}`, createEngineLabelData(), {
      overwriteRoutes: true,
    });
};
