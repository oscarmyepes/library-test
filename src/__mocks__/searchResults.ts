import { Product } from '../models/search';

const DEFAULT_PRODUCT: Product = {
  availability: 'Available',
  brand_name: 'Baer Brake Systems',
  condition: 'New',
  dealerid: 'D1247R',
  id: '30519055',
  image_url: 'https://wss.webshopmanager.com/images/F198661686.jpg',
  price: 157.49,
  product_url: 'https://wss.webshopmanager.com/i-30519055',
  remarks: null,
  sale: 10.0,
  thumb_url: 'https://wss.webshopmanager.com/images/T198661686.jpg',
  title:
    'Baer Brake Systems Brake Pads 6S 6 Piston Replacement Pads BAER Brakes D1247R',
};

export const createProductItem = (
  data: Partial<Product> = DEFAULT_PRODUCT
): Product => {
  return {
    ...DEFAULT_PRODUCT,
    ...data,
  };
};
