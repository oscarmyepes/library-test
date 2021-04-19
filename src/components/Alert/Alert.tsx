/*
  Need to disable this rule because I'm using styles[type], so based on the Alert type (success, warning, error),
  the class is configured dynamically. 
 */
import classnames from 'classnames';
import * as React from 'react';
import CheckIcon from '../../icons/CheckIcon';
import CrossIcon from '../../icons/CrossIcon';
import WarningIcon from '../../icons/WarningIcon';
import { AlertProps } from './models';
import styles from './styles/alert.scss';

const Icon = ({ type }: Pick<AlertProps, 'type'>) => {
  switch (type) {
    case 'success':
      return <CheckIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'error':
      return <CrossIcon />;
    default:
      return null;
  }
};

const Alert = ({
  className,
  title,
  type,
  text,
  buttonText,
  onClick,
  showIcon = true,
  fill,
  styled = true,
  style,
}: AlertProps) => (
  <div
    className={classnames(
      styles.root,
      styles[type],
      {
        [styles.styled]: styled,
        [styles.filled]: fill,
      },
      className,
      'Sui-Alert--root'
    )}
    style={style}
  >
    {showIcon ? (
      <div className={classnames(styles.icon, 'Sui-Alert--icon')}>
        <Icon type={type} />
      </div>
    ) : null}
    <div className={classnames(styles.info, 'Sui-Alert--info')}>
      <div className={classnames(styles.title, 'Sui-Alert--title')}>
        {title}
      </div>
      {text ? (
        <div className={classnames(styles.text, 'Sui-Alert--text')}>{text}</div>
      ) : null}
    </div>

    {onClick && buttonText ? (
      <div className={classnames(styles.actionContainer, 'Sui-Alert--action')}>
        <button role="button" className={styles.button} onClick={onClick}>
          {buttonText}
        </button>
      </div>
    ) : null}
  </div>
);

export default Alert;
