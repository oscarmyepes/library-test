import classnames from 'classnames';
import * as React from 'react';
import CategoryItem from '../../common/CategoryItem/CategoryItem';
import List from '../../common/List/List';
import { CategoryListProps } from './models';
import styles from './styles/categoryList.scss';

const CategoryItems = ({
  renderList,
  list,
  linkEl,
  orientation,
  styled,
  onItemClick,
}: Pick<
  CategoryListProps,
  'renderList' | 'list' | 'linkEl' | 'orientation' | 'styled' | 'onItemClick'
>): JSX.Element => {
  return renderList ? (
    renderList(list)
  ) : (
    <>
      {list.map((item) => {
        const Link = item.url ? linkEl : 'div';
        const linkProps = item.url ? { href: item.url } : {};
        return (
          <Link
            className={classnames(
              styles.categoryLink,
              {
                [styles.horizontal]: orientation === 'horizontal',
                [styles.categoryLinkStyled]: styled,
                [styles.withArrow]: Link !== 'div',
                [styles.cursorPointer]: !!onItemClick,
              },
              'Sui-CategoryList--root'
            )}
            key={item.id}
            role="listitem"
            onClick={(e) => onItemClick?.(e, item)}
            {...linkProps}
          >
            <CategoryItem category={item} />
          </Link>
        );
      })}
    </>
  );
};

const CategoryList = ({
  list,
  linkEl,
  orientation = 'horizontal',
  itemsPerPage,
  styled,
  onItemsPerPageChange,
  onItemClick,
  ...listProps
}: CategoryListProps) => {
  const Link = linkEl || 'a';
  const [itemsPerPageInternal, setItemsPerPage] = React.useState(itemsPerPage);
  const [orientationInternal, setOrientation] = React.useState(orientation);

  React.useEffect(() => {
    setItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  React.useEffect(() => {
    setOrientation(orientation);
  }, [orientation]);

  return (
    <List
      {...listProps}
      className={classnames(listProps.className, styles.listContainer)}
      list={list}
      orientation={orientationInternal}
      onLayoutChange={setOrientation}
      itemsPerPage={itemsPerPageInternal}
      onItemsPerPageChange={(value) => {
        onItemsPerPageChange(value);
        setItemsPerPage(value);
      }}
      styled={styled}
    >
      <CategoryItems
        orientation={orientationInternal}
        list={list}
        linkEl={Link}
        styled={styled}
        onItemClick={onItemClick}
      />
    </List>
  );
};

export default CategoryList;
