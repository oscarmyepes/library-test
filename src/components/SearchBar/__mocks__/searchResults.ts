import { ResultItem } from '../models';

const DEFAULT_ITEM: ResultItem = {
  availability: 'Available',
  brand_name: 'Baer Brake Systems',
  condition: 'New',
  dealerid: 'D1247R',
  googlebase_category: null,
  id: '30519055',
  image_urls: ['https://wss.webshopmanager.com/images/F198661686.jpg'],
  inventory: 0,
  meta_description:
    // eslint-disable-next-line max-len
    'Find D1247R Brake Pads 6S 6 Piston Replacement Pads BAER Brakes from Baer Brake Systems you need and other parts at (Sitename).',
  meta_keywords:
    'Baer Brake Systems, D1247R, Brake Pads 6S 6 Piston Replacement Pads BAER Brakes Brake Pads, (SiteURL)',
  price: 157.49,
  product_url: ['https://wss.webshopmanager.com/i-30519055'],
  remarks: null,
  sale: 10.0,
  score: 18.387154,
  stockid: 'D1247R-BKCZ',
  thumb_urls: ['https://wss.webshopmanager.com/images/T198661686.jpg'],
  title:
    'Baer Brake Systems Brake Pads 6S 6 Piston Replacement Pads BAER Brakes D1247R',
};

export const createResultItem = (
  data: Partial<ResultItem> = DEFAULT_ITEM
): ResultItem => {
  return {
    ...DEFAULT_ITEM,
    ...data,
  };
};
