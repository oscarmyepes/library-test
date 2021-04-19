import classnames from 'classnames';
import * as React from 'react';
import ListControls from '../../components/ListControls';
import Pagination from '../../components/Pagination';
import { Orientation } from '../../models/generic';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import styles from './list.scss';

export interface ListProps<T> {
  /**
   * The list to be rendered.
   */
  list: Array<T>;
  /**
   * Element to be rednered as list
   */
  children: React.ReactNode;
  /**
   * The selected page.
   */
  currentPage?: number;
  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * How many items per page should be visible.
   */
  itemsPerPage?: number;
  /**
   * Total pages when pagination is enabled, this number must be sent when `showPagination` property is TRUE.
   */
  totalPages?: number;
  /**
   * If you want to show the pagination component, send this flag as TRUE.
   */
  showPagination?: boolean;
  /**
   * If you want to use our default styles, set this property to `true`.
   */
  styled?: boolean;
  /**
   * The list can be displayed as a Grid or as a List.
   *
   * Send orientation = `vertical` to show the list as a grid.
   *
   * Send orientation = `horizontal` to show the list as horizontal list.
   */
  orientation?: Orientation;
  /**
   * Callback fired when the page is changed after clicking a page number in the pagination component.
   */
  onPageChanged?: (page: number) => void;
  /**
   * To show a loading indicator when `styled` and `isLoading` properties are  TRUE.
   */
  showLoadingIndicator?: boolean;
  /**
   * Callback to render any component when there are no results (when the list is empty).
   */
  renderNoResults?: () => JSX.Element;
  /**
   * Flag to indicate when the list is loading data from API.
   */
  isLoading?: boolean;
  /**
   * Flag to show the list controls.
   */
  showControls?: boolean;
  /**
   * Callback fired when the user changes the visible items per page drop down in the list controls.
   */
  onItemsPerPageChange?: (value: number) => void;
  /**
   * Callback fired when the user changes the layout of the list, to display the list as a Grid or as a List.
   */
  onLayoutChange?: (value: Orientation) => void;
  /**
   * Callback fired when user clicks a list item.
   */
  onItemClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    data: T
  ) => void;
}

function List<T>({
  children,
  list,
  totalPages = 1,
  currentPage = 1,
  onPageChanged = () => null,
  className = '',
  styled,
  orientation = 'horizontal',
  onLayoutChange,
  showPagination = false,
  showLoadingIndicator = false,
  renderNoResults,
  isLoading,
  showControls,
  itemsPerPage,
  onItemsPerPageChange,
}: ListProps<T>) {
  const noResults = () => {
    if (!isLoading) {
      return renderNoResults ? (
        renderNoResults()
      ) : (
        <h1 className="Sui-List--no-results">No results</h1>
      );
    }

    return null;
  };

  return (
    <div className={classnames(styles.root, className)}>
      {showControls ? (
        // TODO get sort options from API
        <ListControls
          orientation={orientation}
          onLayoutChange={onLayoutChange}
          onItemsPerPageChange={(value) => onItemsPerPageChange(value)}
          itemsPerPage={itemsPerPage}
          styled={styled}
        />
      ) : null}
      {showLoadingIndicator && styled && isLoading ? (
        <LoadingIndicator type="linear" className={styles.loadingIndicator} />
      ) : null}

      {list.length ? (
        <>
          <div
            className={classnames(
              styles.listContainer,
              {
                [styles.isBusy]: styled && isLoading,
                [styles.listHorizontal]: orientation === 'horizontal',
                [styles.listContainerStyled]: styled,
                'Sui-List--horizontal': orientation === 'horizontal',
              },
              'Sui-List--container'
            )}
            data-testid="listContainer"
          >
            {children}
          </div>
          {showPagination ? (
            <Pagination
              className={styles.pagination}
              totalPages={totalPages}
              currentPage={currentPage}
              onChangePage={onPageChanged}
            />
          ) : null}
        </>
      ) : (
        noResults()
      )}
    </div>
  );
}

export default List;
