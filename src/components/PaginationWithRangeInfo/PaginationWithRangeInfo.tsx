import classnames from 'classnames';
import * as React from 'react';
import Pagination from '../Pagination/Pagination';
import { PaginationWithRangeInfoProps } from './models';
import styles from './paginationWithRangeInfo.scss';

const PaginationWithRangeInfo = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onChangePage = () => null,
  className,
}: PaginationWithRangeInfoProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPageInternal =
    currentPage > totalPages ? totalPages : Math.max(currentPage, 1);
  const from =
    currentPageInternal === 1
      ? 1
      : itemsPerPage * (currentPageInternal - 1) + 1;
  const to = Math.min(itemsPerPage * currentPageInternal, totalItems);

  return (
    <div
      className={classnames(
        styles.root,
        'Sui-PaginationWithRange--container',
        className
      )}
    >
      <div>
        Items {from}-{to} of {totalItems}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    </div>
  );
};

export default PaginationWithRangeInfo;
