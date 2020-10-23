import classnames from 'classnames';
import * as React from 'react';
import styles from './index.scss';
import { NativeSelectProps } from './models';

/*
  Variable to track how many Selects were rendered to assign an unique ID
  WARNING: this is an autogenrated ID and at this moment its only useful for
  automated tests (end-to-end)
*/

let renderedItems = 0;

const NativeSelect = ({
  className = '',
  styled,
  isVertical,
  options,
  value,
  disabled = false,
  name,
  onChange,
}: NativeSelectProps) => {
  const [counter] = React.useState(() => {
    renderedItems += 1;
    return renderedItems;
  });
  return (
    <select
      id={`sui-fitment-selector-${counter}`}
      className={classnames(
        {
          [`${styles.StyledSelect} SuiSelect`]: styled,
          [styles.StyledSearchBtnVertical]: styled && isVertical,
        },
        className
      )}
      disabled={disabled}
      value={value}
      onChange={onChange}
      role="listbox"
    >
      <option key={0} value="" role="option" aria-selected={false}>
        {name}
      </option>
      <option key={-1} disabled={true} role="option" aria-selected={false}>
        ---
      </option>
      {options.map((data) => (
        <option
          id={String(data.id)}
          role="option"
          key={data.id}
          value={data.id}
          aria-selected={value === data.id}
        >
          {data.name}
        </option>
      ))}
    </select>
  );
};

export default NativeSelect;
