/* eslint-disable sort-keys */

import { SearchbarSection } from '../models';

export const sections: SearchbarSection[] = [
  {
    type: 'category',
    title: 'Categories',
    data: {
      list: Array.from({ length: 10 }).map((_, index) => ({
        id: index + 1,
        name: `Category ${index + 1}`,
        image_url: '',
      })),
      total: 50,
    },
  },
  {
    type: 'brand',
    title: 'Brands',
    data: {
      list: Array.from({ length: 5 }).map((_, index) => ({
        id: index + 1,
        name: `Brand ${index + 1}`,
        image_url: '',
        url: 'http://google.com',
      })),
      total: 5,
    },
  },
  {
    type: 'product',
    title: 'Products',
    data: {
      list: [
        {
          availability: 'Available',
          brand_name: 'Baer Brake Systems',
          condition: 'New',
          dealerid: 'D1247R',
          id: '30519055',
          price: 157.49,
          product_url: 'https://wss.webshopmanager.com/i-30519055',
          remarks: null,
          sale: 10.0,
          image_url: 'https://wss.webshopmanager.com/images/T198661686.jpg',
          title:
            'Baer Brake Systems Brake Pads 6S 6 Piston Replacement Pads BAER Brakes D1247R',
        },
      ],
      total: 1,
    },
  },
];

export const productVisibleFields = [{ prop: 'title' }, { prop: 'brand_name' }];
