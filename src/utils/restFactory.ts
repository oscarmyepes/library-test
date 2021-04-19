import { GenericObject } from '../models/generic';
import { stringify } from 'querystring';
import { getConfig } from '../config';

export interface IRestFactory {
  get: <T>(
    path: string,
    params?: GenericObject,
    signal?: AbortSignal
  ) => Promise<T>;
}

const restService = (): IRestFactory => ({
  async get<T>(
    path: string,
    params: GenericObject = {},
    signal?: AbortSignal
  ): Promise<T> {
    const API_KEY = getConfig().API_KEY;
    if (!API_KEY) {
      const errorMsg = 'API_KEY is not valid. Please enter a valid one.';
      console.error(errorMsg);
    }
    // This try-catch is useful because fetch does not return error when response is not ok
    // so we want to catch any real error and bad responses.
    // eslint-disable-next-line no-useless-catch
    try {
      const clearedParams = JSON.parse(JSON.stringify(params));
      const query = Object.keys(clearedParams).length
        ? `?${stringify(clearedParams)}`
        : '';
      const response = await fetch(`${path}${query}`, {
        headers: { 'sunhammer-api-key': API_KEY },
        signal,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  },
});

export default restService();
