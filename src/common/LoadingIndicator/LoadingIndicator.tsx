import * as React from 'react';
import classnames from 'classnames';
import styles from './loadingIndicator.scss';

interface LoadingIndicatorProps {
  type: 'linear' | 'circular';
  className?: string;
}

const LoadingIndicator = ({ type, className = '' }: LoadingIndicatorProps) =>
  type === 'linear' ? (
    <div className={classnames(styles.root, className)} />
  ) : (
    <div className={styles['sk-fading-circle']}>
      <div className={classnames(styles['sk-circle'])}></div>
      {Array.from({ length: 11 }).map((_, index) => (
        <div
          key={index}
          className={classnames(
            styles[`sk-circle${index + 2}`],
            styles['sk-circle']
          )}
        ></div>
      ))}
    </div>
  );

export default LoadingIndicator;
