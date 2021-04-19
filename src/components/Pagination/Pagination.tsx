import classnames from 'classnames';
import * as React from 'react';
import Angle from '../../icons/Angle';
import { PageNumberContainerProps, PaginationProps } from './models';
import styles from './pagination.scss';

const PageNumberContainer = ({
  disabled,
  children,
  onClick = () => null,
  className,
}: PageNumberContainerProps) => {
  return (
    <button
      className={classnames(className, {
        [styles.disabled]: disabled,
      })}
      onClick={onClick}
      disabled={disabled}
      role="button"
    >
      {children}
    </button>
  );
};

const LIMIT_VISIBLE_PAGE_NUMBER = 7;

const Pagination = ({
  totalPages,
  currentPage,
  className = '',
  onChangePage = () => null,
}: PaginationProps) => {
  /*
    We render pages with 3 dots when needed. So this logic configures an array
    of visible pages and then we make the math to check if 3 dots (...) should be rendered
    after first page and/or before last page.
    Examples:
    < 1 2 3 4 5 6 >
    < 1 2 3 4 5 ... 10 >
    < 1 ... 5 6 7 ... 10 >
    < 1 ... 6 7 8 9 10 >
  */
  let from =
    totalPages > LIMIT_VISIBLE_PAGE_NUMBER &&
    currentPage > LIMIT_VISIBLE_PAGE_NUMBER / 2
      ? Math.ceil(currentPage - 1 - LIMIT_VISIBLE_PAGE_NUMBER / 2)
      : 0;

  let to =
    totalPages > LIMIT_VISIBLE_PAGE_NUMBER &&
    currentPage < Math.ceil(totalPages - LIMIT_VISIBLE_PAGE_NUMBER / 2)
      ? from + LIMIT_VISIBLE_PAGE_NUMBER
      : totalPages;

  /*
    When rendering the last pages and 3 dots after the first page,
    we want to render always the same amount of pages, so here we 
    overwrite the from value to render this:
    < 1 ... 6 7 8 9 10 > 
    instead of:
    < 1 ...9 10 > when one of the last pages is selected.
  */
  if (
    totalPages > LIMIT_VISIBLE_PAGE_NUMBER &&
    to === totalPages &&
    to - from < LIMIT_VISIBLE_PAGE_NUMBER
  ) {
    from = to - LIMIT_VISIBLE_PAGE_NUMBER;
  }

  from += 1;
  to += 1;
  const visiblePagesLength = to - from;
  const pages = Array.from({ length: visiblePagesLength }).map((_, index) => {
    const pageNumber = index + from;
    // Force render first page number
    if (pageNumber >= 2 && index === 0) {
      return 1;
    }
    // Force render 3 dots after first page and/or before last page
    if (
      (pageNumber > 2 && index === 1) ||
      (index === visiblePagesLength - 2 && pageNumber <= totalPages - 2)
    ) {
      return -1;
    }
    // Force render last page number
    if (index === visiblePagesLength - 1) {
      return totalPages;
    }
    return pageNumber;
  });

  const renderPageNumber = (page) => (
    <PageNumberContainer
      className={classnames(
        styles.pageLink,
        {
          [styles.active]: currentPage === page,
        },
        'Sui-Pagination--page-number'
      )}
      onClick={() => onChangePage(page)}
      disabled={currentPage === page}
    >
      {page}
    </PageNumberContainer>
  );

  const renderDots = () => (
    <PageNumberContainer className={styles.pageLink} disabled={true}>
      ...
    </PageNumberContainer>
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={classnames(styles.root, className)}
      data-testid="pagination"
    >
      <PageNumberContainer
        className={classnames(styles.pageLink, 'Sui-Pagination--prev-page')}
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Angle className={styles.angleIcon} />
      </PageNumberContainer>

      {pages.map((item, index) => (
        <React.Fragment key={index}>
          {item < 0 ? renderDots() : renderPageNumber(item)}
        </React.Fragment>
      ))}

      <PageNumberContainer
        className={classnames(styles.pageLink, 'Sui-Pagination--next-page')}
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Angle className={styles.angleIconRight} />
      </PageNumberContainer>
    </div>
  );
};

export default Pagination;
