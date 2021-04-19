import debounce from 'lodash/debounce';
import classnames from 'classnames';
import * as React from 'react';
import CrossIcon from '../../icons/CrossIcon';
import styles from './styles/breadCrumb.scss';
import { BreadCrumbProps, BreadcrumbItem } from './models';
import PathItem from './PathItem';

const DEBOUNCE_DELAY = 100;

const BreadCrumb = ({
  paths,
  filters,
  styled,
  onBreadcumbClick,
  onRemoveFilter,
}: BreadCrumbProps) => {
  const PathLink = paths?.linkEl || 'a';
  const [visibleBreadcrumbs, setVisibleBreadcrumbs] = React.useState(() =>
    collapseBreadcrumb(paths?.list, paths.maxItems || paths?.list.length)
  );
  const [hideBreadcrumb, setHideBreadcrumb] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [internalPaths, setInternalPaths] = React.useState(paths);

  React.useEffect(() => {
    setInternalPaths(paths);
    setVisibleBreadcrumbs(
      collapseBreadcrumb(paths?.list, paths?.maxItems || paths?.list?.length)
    );
  }, [paths]);

  React.useLayoutEffect(() => {
    window.addEventListener('resize', debouncedCalcCollapsedItems);
    debouncedCalcCollapsedItems();
    return () => {
      window.removeEventListener('resize', debouncedCalcCollapsedItems);
    };
  }, [expanded]);

  const debouncedCalcCollapsedItems = React.useCallback(
    debounce(() => {
      if (!expanded) {
        setVisibleBreadcrumbs([...internalPaths.list]);
        setHideBreadcrumb(true);
      }
    }, DEBOUNCE_DELAY),
    [expanded]
  );

  React.useEffect(() => {
    if (hideBreadcrumb) {
      const breadCrumbParent = document.getElementById('sui-breadcrum-list');
      const widths = Array.from(breadCrumbParent.childNodes).map(
        (item: HTMLLIElement) => item.clientWidth
      );
      const numElToHide = getNumberOfItemsToHide(
        breadCrumbParent.clientWidth,
        widths
      );
      setVisibleBreadcrumbs(
        collapseBreadcrumb(
          internalPaths?.list,
          internalPaths.maxItems || internalPaths?.list.length - numElToHide
        )
      );
      setHideBreadcrumb(false);
    }
  }, [hideBreadcrumb]);

  const onExpandBreadcrumb = () => {
    setVisibleBreadcrumbs(internalPaths.list);
    setExpanded(true);
  };

  const validatedFilters = Array.isArray(filters) ? filters : [];
  const validVisibleBreadcrumbs = Array.isArray(visibleBreadcrumbs)
    ? visibleBreadcrumbs
    : [];

  return (
    <div className={classnames({ [styles.rootStyled]: styled })}>
      <ul
        id="sui-breadcrum-list"
        className={classnames(styles.ul, {
          [styles.hideBreadcrumb]: hideBreadcrumb,
        })}
      >
        {validVisibleBreadcrumbs.map((item, index) => (
          <PathItem
            key={item.label}
            PathLink={PathLink}
            item={item}
            onBreadcumbClick={onBreadcumbClick}
            showSeparator={index < validVisibleBreadcrumbs?.length - 1}
            separator={internalPaths.separator}
            showDots={
              validVisibleBreadcrumbs.length < internalPaths?.list?.length &&
              index === 0
            }
            onExpandBreadcrumb={onExpandBreadcrumb}
          />
        ))}
      </ul>
      <ul className={classnames(styles.ul, styles.filtersContainer)}>
        {validatedFilters?.map((item) => (
          <li
            key={item.id}
            className={classnames(styles.filter, 'Sui-BreadCrumb--filter')}
            style={item.color ? { backgroundColor: item.color } : null}
          >
            {item.label}
            <button
              className={classnames(
                styles.removeFilterBtn,
                'Sui-BreadCrumb--remove-filter-btn'
              )}
              type="reset"
              aria-label="clear"
              onClick={() => onRemoveFilter?.(item)}
            >
              <CrossIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BreadCrumb;

function collapseBreadcrumb(list: BreadcrumbItem[] = [], maxItems = 0) {
  if (list?.length > maxItems) {
    return [list[0], ...list.slice(list.length - maxItems + 1, list.length)];
  }
  return list;
}

function getNumberOfItemsToHide(containerWidth: number, list: number[]) {
  if (containerWidth > list.reduce((item, acc) => acc + item, 0)) {
    return 0;
  }

  const hideableItems = list.slice(1, list.length - 1);
  let widthHideableItems = hideableItems.reduce((item, acc) => acc + item, 0);
  // Unfortunatelly we have to query element in the DOM to get the widths and do
  // the math to collapse the breadcrumb in small devices.
  const availableSpace =
    containerWidth -
    list[0] -
    list[list.length - 1] -
    (document.getElementsByClassName('Sui-BreadCrumb--separator')?.[0]
      ?.clientWidth ||
      0 +
        document.querySelector('#sui-breadCrumb--ellipsis button')
          ?.clientWidth ||
      0) -
    11.11; // 11.11 is the width of the ellipsis element

  let count = 0;

  if (availableSpace <= 0) return 0;

  while (availableSpace - widthHideableItems <= 0) {
    widthHideableItems -= hideableItems[count];
    count += 1;
  }
  return count;
}
