/* eslint-disable sort-keys */
import { BreadCrumbProps } from '../models';

type DataType = {
  paths: BreadCrumbProps['paths'];
  filters: BreadCrumbProps['filters'];
};

export const data: DataType = {
  filters: [
    { id: 1, label: 'fitment: 2010 Ford F-150', color: '#feeeb6' },
    { id: 2, label: 'Bed Length: 6', color: '#cddffa' },
    { id: 3, label: 'keyword: tonneau cover', color: '#f8f8f8' },
    { id: 4, label: 'brand: Retrax', color: '#f8f8f8' },
    { id: 5, label: 'brand: Extang', color: '#f8f8f8' },
  ],
  paths: {
    separator: '>',
    list: [
      { label: 'Home', url: 'http://google.com' },
      { label: 'Exterior', url: 'http://google.com' },
      { label: 'Truck Bed', url: 'http://google.com' },
      { label: 'Tonneau Covers', url: 'http://google.com' },
      { label: 'Product Page', url: 'http://google.com' },
    ],
  },
};
