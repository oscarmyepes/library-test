import { FacetFiltersData } from '../../../models/search';
export const data: FacetFiltersData = {
  brand_name: {
    order: 1,
    title: 'Brands',
    values: [
      'AirAid',
      'Banks Power',
      'Cometic Gasket Automotive',
      'Deviant Race Parts',
      'Evans Cooling',
      'Fabtech',
      'K&N',
      'Mahle Motorsport',
      'No Limit Fabrication',
      'Pacbrake',
      'South Bend Clutch',
    ],
  },
  condition: {
    collapsed: true,
    order: 2,
    title: 'Condition',
    values: ['New', 'Used'],
  },
  price: {
    order: 3,
    title: 'Price',
    type: 'priceRange',
    values: [[0, 25], [25, 50], [50, 100], [100, 200], [200]],
  },
};
