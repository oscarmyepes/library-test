import classnames from 'classnames';
import * as React from 'react';
import { PathItemProps, BreadCrumbProps } from './models';
import styles from './styles/separator.scss';

const Separator = ({
  separator,
}: {
  separator: BreadCrumbProps['paths']['separator'];
}) => {
  const Divider = separator as React.ElementType;
  return (
    <span className={classnames(styles.separator, 'Sui-BreadCrumb--separator')}>
      {typeof separator === 'function' ? <Divider /> : separator}
    </span>
  );
};

const PathItem = ({
  PathLink,
  item,
  onBreadcumbClick,
  showSeparator,
  separator,
  showDots,
  onExpandBreadcrumb,
}: PathItemProps) => (
  <>
    <li className="Sui-BreadCrumb--path" role="listitem">
      <PathLink
        className={styles.pathItemText}
        href={item.url}
        onClick={() => onBreadcumbClick?.(item)}
      >
        {item.label}
      </PathLink>
      {showSeparator ? <Separator separator={separator} /> : null}
    </li>
    {showDots ? (
      <li id="sui-breadCrumb--ellipsis" role="listitem">
        <button
          className={styles.ellipsisClikable}
          onClick={onExpandBreadcrumb}
        >
          ...
        </button>
        <Separator separator={separator} />
      </li>
    ) : null}
  </>
);

export default PathItem;
