import { GenericObject } from '../models/generic';
import { stringify } from 'querystring';

export interface IRestFactory {
  // tslint:disable-next-line
  get: (path: string, params?: GenericObject) => Promise<any>;
}

const restService = (): IRestFactory => ({
  // tslint:disable-next-line
  async get(path: string, params?: GenericObject): Promise<any> {
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
