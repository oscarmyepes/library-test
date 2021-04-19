import { render } from '@testing-library/react';
import * as React from 'react';
import { BasicItem } from '../../models/search';
import CategoryCarousel from './CategoryCarousel';

jest.mock('react-slick', () =>
  React.forwardRef((props: any, ref: any) => (
    <div ref={ref}>{props.children}</div>
  ))
);

describe('CategoryCarousel', () => {
  beforeAll(() => jest.resetAllMocks());

  it('Should call onItemClick when user clicks a carousel item and the callback is configured', async () => {
    const onItemClick = jest.fn();
    const list: BasicItem[] = Array.from({ length: 3 }).map((_, index) => ({
      id: index + 1,
      name: `Category ${index + 1}`,
    }));
    const { findByText } = render(
      <CategoryCarousel list={list} onItemClick={onItemClick} />
    );

    const itemOne = await findByText(list[0].name);
    itemOne.click();
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ _reactName: 'onClick' }),
      list[0]
    );

    onItemClick.mockReset();

    const itemTwo = await findByText(list[1].name);
    itemTwo.click();
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ _reactName: 'onClick' }),
      list[1]
    );
  });
});
