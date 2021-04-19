import * as React from 'react';
import { BasicItem } from '../../models/search';
import Image from '../Image/Image';

interface CategoryItem {
  category: BasicItem;
}

const CategoryItem = ({ category }: CategoryItem) => {
  return (
    <>
      <div className={'Sui-CategoryList--image-container'}>
        <Image
          className={'Sui-CategoryList--image'}
          url={category.image_url}
          alt="categoryImage"
        />
      </div>
      <h1 className={'Sui-CategoryList--title'}>{category.name}</h1>
    </>
  );
};

export default CategoryItem;
