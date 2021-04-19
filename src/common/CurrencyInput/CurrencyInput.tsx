import classnames from 'classnames';
import * as React from 'react';
import { toLocaleNumber } from '../../utils/format';
import styles from './currencyInput.scss';

interface CurrencyInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  className?: string;
  styled?: boolean;
  onChange: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CurrencyInput = ({
  className = '',
  styled,
  onChange,
  value,
  ...inputProps
}: CurrencyInputProps) => {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.currentTarget.value.replace(/,/g, '');
    if (/^\d+$/.test(data) || isEmpty(data)) {
      onChange(isEmpty(data) ? null : Number(data), e);
    }
  };

  return (
    <span className={styles.inputContainer}>
      <input
        {...inputProps}
        value={value || value === 0 ? toLocaleNumber(Number(value)) : ''}
        className={classnames({ ['SuiInput']: styled }, className)}
        onChange={onInputChange}
      ></input>
    </span>
  );
};

export default CurrencyInput;

function isEmpty(str) {
  return str === '' || str === undefined;
}
