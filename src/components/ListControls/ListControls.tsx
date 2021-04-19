import classnames from 'classnames';
import * as React from 'react';
import GridIcon from '../../icons/Grid';
import ListIcon from '../../icons/List';
import { ListControlsProps } from '../ListControls/models';
import styles from './listControls.scss';

const ListControls = ({
  orientation,
  onLayoutChange,
  onItemsPerPageChange,
  itemsPerPage,
  styled,
  className,
  itemsPerPageOptions = [5, 10, 20, 50, 100],
  sortOptions,
  selectedSort,
  onSortChange,
}: ListControlsProps) => {
  return (
    <div
      className={classnames(
        styles.root,
        { [styles.rootStyled]: styled },
        'Sui-ListControls--container',
        className
      )}
    >
      {sortOptions ? (
        <div className={styles.left}>
          <p>Sort: </p>
          <select
            onChange={(e) =>
              onSortChange && onSortChange(e.currentTarget.value)
            }
            role="listbox"
            value={selectedSort || 0}
          >
            {sortOptions.map((option) => (
              <option
                role="option"
                key={option.id}
                value={option.id}
                aria-selected={option.id === selectedSort}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className={styles.right}>
        <div className={styles.itemsPerPageContainer}>
          <p>View: </p>
          <select
            onChange={(e) =>
              onItemsPerPageChange(Number(e.currentTarget.value))
            }
            role="listbox"
            value={itemsPerPage}
          >
            {itemsPerPageOptions.map((option) => (
              <option
                role="option"
                key={option}
                value={option}
                aria-selected={itemsPerPage === option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          className={styles.iconContainer}
          onClick={() => onLayoutChange('vertical')}
          aria-label="grid layout"
        >
          <GridIcon
            className={classnames(styles.icon, {
              [styles.selected]: orientation === 'vertical',
            })}
          />
        </button>
        <button
          className={styles.iconContainer}
          onClick={() => onLayoutChange('horizontal')}
          aria-label="list layout"
        >
          <ListIcon
            className={classnames(styles.icon, {
              [styles.selected]: orientation === 'horizontal',
            })}
          />
        </button>
      </div>
    </div>
  );
};

export default ListControls;
