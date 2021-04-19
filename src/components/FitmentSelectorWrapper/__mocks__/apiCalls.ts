import fetchMock from 'fetch-mock';
import { stringify } from 'querystring';
import { FitmentSelectorWrapperProps } from '../models';
import {
  createEngineLabelData,
  createLabels,
  createMakeLabelData,
  createModelLabelData,
  createOptionalLabels,
  createSubModelLabelData,
  createYearLabelData,
} from './labels';
import { env } from '../../../config';

export const LABELS = createLabels();
export const OPTIONAL_LABELS = createOptionalLabels();
export const YEARS = createYearLabelData();
export const MAKERS = createMakeLabelData();
export const MODELS = createModelLabelData();
export const SUB_MODELS = createSubModelLabelData();
export const ENGINE = createEngineLabelData();

function mockApiCalls(filter: FitmentSelectorWrapperProps['filter'] = {}) {
  const queryParams = Object.keys(filter).length ? `?${stringify(filter)}` : '';
  const queryParamsToAppend = queryParams ? `${queryParams}&` : '?';

  fetchMock.get(`${env.API_URL}/fitment/labels${queryParams}`, LABELS);
  fetchMock.get(
    `${env.API_URL}/fitment/optionalLabels${queryParams}`,
    OPTIONAL_LABELS,
    {
      delay: 0,
    }
  );

  fetchMock.get(`${env.API_URL}/fitment/year${queryParams}`, YEARS, {
    delay: 0,
  });
  fetchMock.get(
    `${env.API_URL}/fitment/make${queryParamsToAppend}year=1`,
    MAKERS,
    {
      delay: 0,
    }
  );
  fetchMock.get(
    `${env.API_URL}/fitment/model${queryParamsToAppend}year=1&make=1`,
    MODELS,
    {
      delay: 0,
    }
  );
  fetchMock.get(
    `${env.API_URL}/fitment/submodel${queryParamsToAppend}year=1&make=1&model=1`,
    SUB_MODELS,
    { delay: 0 }
  );
  fetchMock.get(
    `${env.API_URL}/fitment/engine${queryParamsToAppend}year=1&make=1&model=1&submodel=1`,
    ENGINE,
    { delay: 0 }
  );

  fetchMock.get(
    `${env.API_URL}/fitment/body${queryParamsToAppend}year=1&make=1&model=1&submodel=1&engine=1`,
    ENGINE,
    { delay: 0 }
  );
}

export { mockApiCalls };
