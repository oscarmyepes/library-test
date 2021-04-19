import classnames from 'classnames';
import * as React from 'react';
import List from '../../common/List/List';
import ProductListItem, {
  DEFAULT_VISIBLE_FIELDS,
} from '../../common/ProductListItem/ProductListItem';
import { ProductListProps } from './models';
import styles from './styles/productList.scss';

const ListItems = ({
  renderList,
  data,
  styled,
  orientation,
  visibleFields,
  noImageUrl,
  linkEl,
  onItemClick,
}) => {
  return renderList
    ? renderList(data)
    : data.map((item) => {
        const Link = item.url ? linkEl : 'div';
        const linkProps = item.url ? { href: item.url } : {};
        return (
          <Link
            className={classnames(styles.productLink, {
              'Sui-List--product-link': Link !== 'div',
              [styles.cursorPointer]: !!onItemClick,
            })}
            key={item.id}
            onClick={(e) => onItemClick?.(e, item)}
            {...linkProps}
          >
            <ProductListItem
              className={classnames(styles.productGridItem, {
                [styles.resultItemStyledInGrid]:
                  styled && orientation === 'vertical',
              })}
              data={item}
              styled={styled}
              orientation={orientation}
              visibleFields={visibleFields}
              noImageUrl={noImageUrl}
            />
          </Link>
        );
      });
};

const ProductList = ({
  list,
  totalPages = 1,
  currentPage = 1,
  onPageChanged = () => null,
  className = '',
  styled,
  orientation = 'horizontal',
  showPagination = false,
  showLoadingIndicator = false,
  visibleFields = DEFAULT_VISIBLE_FIELDS,
  renderList,
  renderNoResults,
  isLoading,
  noImageUrl,
  linkEl,
  showControls,
  itemsPerPage,
  onItemsPerPageChange,
  onLayoutChange,
  onItemClick,
}: ProductListProps) => {
  const Link = linkEl || 'a';
  const [itemsPerPageInternal, setItemsPerPage] = React.useState(itemsPerPage);
  const [orientationInternal, setOrientation] = React.useState(orientation);

  React.useEffect(() => {
    setOrientation(orientation);
  }, [orientation]);

  React.useEffect(() => {
    setItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  return (
    <List
      list={list}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChanged={onPageChanged}
      className={className}
      orientation={orientationInternal}
      showPagination={showPagination}
      showLoadingIndicator={showLoadingIndicator}
      renderNoResults={renderNoResults}
      isLoading={isLoading}
      showControls={showControls}
      itemsPerPage={itemsPerPageInternal}
      onItemsPerPageChange={(value) => {
        onItemsPerPageChange?.(value);
        setItemsPerPage(value);
      }}
      onLayoutChange={(value) => {
        setOrientation(value);
        onLayoutChange?.(value);
      }}
      styled={styled}
    >
      <ListItems
        renderList={renderList}
        data={list}
        styled={styled}
        orientation={orientationInternal}
        visibleFields={visibleFields}
        noImageUrl={noImageUrl}
        linkEl={Link}
        onItemClick={onItemClick}
      />
    </List>
  );
};

export default ProductList;
