import classnames from 'classnames';
import * as React from 'react';
import { FacetSectionCheckbox, FacetSectionProps } from './models';
import styles from './styles/facetSection.scss';

const SelectableItem = ({
  label,
  value,
  checked,
  styled,
  onChange,
  isSingleSelect,
}: FacetSectionCheckbox) => (
  <div
    className={classnames(
      styles.checkboxContainer,
      {
        [styles.styledCheckboxContainer]: styled,
      },
      'Sui-FacetSection-checkbox-container'
    )}
  >
    <input
      className={classnames(
        { [styles.styledCheckbox]: styled },
        'Sui-FacetSection-checkbox'
      )}
      type={isSingleSelect ? 'radio' : 'checkbox'}
      role={isSingleSelect ? 'radio' : 'checkbox'}
      id={String(value)}
      name={String(value)}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.currentTarget.value)}
    ></input>
    <label
      className={classnames(
        styles.checkboxLabel,
        'Sui-FacetSection-checkbox-label'
      )}
      htmlFor={String(value)}
    >
      {label}
    </label>
  </div>
);

const FacetSection = ({
  className = '',
  values,
  selectedValues = [],
  onChange,
  limit = values.length,
  styled,
  isSingleSelect,
}: FacetSectionProps) => {
  const [showMore, setShowMore] = React.useState(false);
  const hasHiddenValues = values.length > limit;
  const valuesToShow = hasHiddenValues ? values.slice(0, limit) : values;
  const hiddenValues = hasHiddenValues ? values.slice(limit) : [];

  const renderSelectableItem = (filter) => {
    return (
      <SelectableItem
        key={filter}
        label={String(filter)}
        value={String(filter)}
        checked={selectedValues.includes(String(filter))}
        onChange={onChange}
        styled={styled}
        isSingleSelect={isSingleSelect}
      />
    );
  };
  const renderSelectedHiddenValues = () =>
    hiddenValues
      .filter((item) => selectedValues.includes(String(item)))
      .map((filter) => renderSelectableItem(filter));

  return (
    <div
      className={classnames(
        className,
        { [styles.sectionContainerStyled]: styled },
        'Sui-FacetSection--container'
      )}
    >
      {valuesToShow.map((filter) => renderSelectableItem(filter))}

      {!showMore && hasHiddenValues ? renderSelectedHiddenValues() : null}

      {showMore && hasHiddenValues
        ? hiddenValues.map((filter) => renderSelectableItem(filter))
        : null}
      {hasHiddenValues ? (
        <button
          className={styles.showMoreBtn}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show less' : 'Show more...'}
        </button>
      ) : null}
    </div>
  );
};

export default FacetSection;
