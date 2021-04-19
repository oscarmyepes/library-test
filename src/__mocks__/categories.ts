/* eslint-disable max-len */
export const categoriesList = [
  {
    id: 1,
    image_url:
      'https://assets.thiecommerce.com/production/category_bed_liners_and_mats_high_res/r/318x238/c/70/1518ea465fad1358991a7606176fd61a.jpg',
    name: 'Category 1',
  },
  {
    id: 2,
    image_url:
      'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=751&q=80',
    name: 'Category 2',
  },
  ...Array.from({ length: 8 }).map((_, index) => ({
    id: index + 3,
    name: `Category ${index + 3}`,
  })),
];
