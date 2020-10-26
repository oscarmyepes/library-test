import { GenericObject } from '../models/generic';
import { stringify } from 'querystring';

export interface IRestFactory {
  get: <T>(path: string, params?: GenericObject) => Promise<T>;
}

const restService = (): IRestFactory => ({
  async get<T>(path: string, params?: GenericObject): Promise<T> {
    // This try-catch is useful because fetch does not return error when response is not ok
    // so we want to catch any real error and bad responses.
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(`${path}?${stringify(params)}`);
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
