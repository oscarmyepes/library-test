import classnames from 'classnames';
import debounce from 'lodash/debounce';
import * as React from 'react';
import {
  FITMENT_SELECTOR_STORAGE_KEY,
  LIMIT_FITMENTS_LOCAL_STORAGE,
} from '../../utils/constants';
import { validateSelectedValues } from '../../utils/fitmentValidator';
import {
  FitmentSelectorStore,
  FitmentSelectorProps,
  Item,
  SelectedValues,
} from './models';
import NativeSelect from './NativeSelect';
import styles from './styles/fitmentSelector.scss';

const Labels = ({
  labels,
  CustomSelect,
  currentSelectedValues,
  onLabelChange,
  labelsData,
  styled,
  isVertical,
}) =>
  labels.map((label, index) =>
    CustomSelect ? (
      <CustomSelect
        key={label.id}
        value={currentSelectedValues[label.name] || ''}
        onChange={(e) => onLabelChange(label.name, e)}
        options={labelsData[label.name]}
        label={label}
      />
    ) : (
      <NativeSelect
        key={label.id}
        onChange={(e) => onLabelChange(label.name, e.currentTarget.value)}
        value={currentSelectedValues[label.name] || ''}
        className="Sui-FitmentSelector--select"
        disabled={
          (index > 0 && !currentSelectedValues[labels[index - 1].name]) ||
          !labelsData[label.name]?.length
        }
        name={label.name}
        options={
          labelsData[label.name]?.map((item) => ({
            id: item.id,
            name: item.name,
          })) || []
        }
        styled={styled}
        isVertical={isVertical}
      />
    )
  );

const FitmentSelector = ({
  autocommit,
  autocommitDelay = 2000,
  className = '',
  clearButtonText = 'Clear',
  components,
  id,
  labels,
  labelsData,
  orientation = 'horizontal',
  onChange,
  onSubmit,
  optionalLabels = [],
  optionalLabelsTitle = 'Optional Fields',
  searchButtonText = 'Search',
  selectedValues,
  styled = false,
}: FitmentSelectorProps) => {
  const [internalSelectedValues, setInternalSelectedValues] = React.useState(
    selectedValues
  );

  React.useEffect(() => {
    const validSelectedValues = validateSelectedValues(
      selectedValues,
      labelsData,
      [...labels, ...optionalLabels]
    );
    setInternalSelectedValues(validSelectedValues);
  }, [selectedValues, labelsData]);

  /**
   * Function to set the value for each label when user changes its value.
   * This function also clears the state of selected labels when a parent label changes
   * Example:
   * Year > Make > Model
   * If all selects have values and user selects a different Year; Make and Model selects must be reseted
   */
  const onLabelChange = async (
    labelId: number | string,
    value: string | number
  ) => {
    const allLabels = [...labels, ...optionalLabels];
    const nextLabelIndex =
      allLabels.findIndex((item) => item.name === labelId) + 1;
    const labelToClearData = allLabels.slice(nextLabelIndex);
    const newSelectedValues = { ...internalSelectedValues, [labelId]: value };

    for (const key of labelToClearData) {
      delete newSelectedValues[key.name];
    }
    // If there is change we cancel the previous debounced function execution to prevent autocommit
    debouncedOnChange.cancel();
    setInternalSelectedValues(newSelectedValues);
    onChange?.(labelId, newSelectedValues);
    if (
      autocommit &&
      Object.keys(newSelectedValues).length ===
        labels.length + optionalLabels.length
    ) {
      debouncedOnChange(newSelectedValues);
    }
  };

  const debouncedOnChange = React.useCallback(
    debounce(async (values) => {
      submit(values);
    }, autocommitDelay),
    [autocommitDelay]
  );

  const onSearch = () => {
    submit(internalSelectedValues);
  };

  const submit = (values: SelectedValues) => {
    const storedFitments: FitmentSelectorStore[] = JSON.parse(
      localStorage.getItem(FITMENT_SELECTOR_STORAGE_KEY) || '[]'
    );
    const newFitmentToStore = getDataToStore(
      internalSelectedValues,
      labels,
      labelsData
    );
    if (!fitmentExistsInLocalStorage(newFitmentToStore, storedFitments)) {
      localStorage.setItem(
        FITMENT_SELECTOR_STORAGE_KEY,
        JSON.stringify([
          newFitmentToStore,
          ...storedFitments.slice(0, LIMIT_FITMENTS_LOCAL_STORAGE),
        ])
      );
    }
    onSubmit?.(values);
  };

  const onClear = () => {
    onChange?.(null, null);
    setInternalSelectedValues(null);
  };

  const isVertical = orientation === 'vertical';
  const CustomSelect = components?.select;
  const currentSelectedValues = internalSelectedValues || {};

  if (!labels.length) {
    return null;
  }

  return (
    <div
      id={id}
      className={classnames(
        styles.root,
        {
          [styles.vertical]: isVertical,
        },
        className
      )}
    >
      <Labels
        labels={labels}
        CustomSelect={CustomSelect}
        currentSelectedValues={currentSelectedValues}
        onLabelChange={onLabelChange}
        labelsData={labelsData}
        styled={styled}
        isVertical={isVertical}
      />
      {Object.keys(internalSelectedValues || {}).length >= labels.length &&
      optionalLabels.length ? (
        <>
          <p className="Sui-FitmentSelector--optional-fields-label">
            {optionalLabelsTitle}
          </p>
          <Labels
            labels={optionalLabels}
            CustomSelect={CustomSelect}
            currentSelectedValues={currentSelectedValues}
            onLabelChange={onLabelChange}
            labelsData={labelsData}
            styled={styled}
            isVertical={isVertical}
          />
        </>
      ) : null}
      {!autocommit ? (
        <div
          className={classnames(
            styles.actions,
            {
              [styles.actionsVertical]: styled && isVertical,
            },
            'Sui-FitmentSelector--actions'
          )}
        >
          <button
            type="button"
            className={classnames(
              {
                [`SuiButton primary ${styles.styledSearchBtn}`]: styled,
                [styles.styledSearchBtnVertical]: styled && isVertical,
              },
              'Sui-FitmentSelector--searchBtn'
            )}
            disabled={Object.keys(currentSelectedValues).length < labels.length}
            onClick={onSearch}
          >
            {searchButtonText}
          </button>
          <button
            type="button"
            className={classnames(
              {
                [`SuiButton secondary ${styles.styledClearBtn}`]: styled,
              },
              'Sui-FitmentSelector--clearBtn'
            )}
            onClick={onClear}
          >
            {clearButtonText}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FitmentSelector;

/**
 * Function to get data to store in LocalStorage.
 * This data will be used in FitmentStore component
 * @returns
 * [
 *  { "label": labelItemData, "value": labelSelectedValue },
 * ]
 */
function getDataToStore(
  selectedValues: SelectedValues,
  labels: Item[],
  labelsData: { [key: string]: Item[] }
) {
  return labels.reduce((acc, label) => {
    if (selectedValues[label.name]) {
      return [
        ...acc,
        {
          label: label,
          value: labelsData[label.name].find(
            (labelData) =>
              String(labelData.id) === String(selectedValues[label.name])
          ),
        },
      ];
    }
    return acc;
  }, []);
}

function fitmentExistsInLocalStorage(newFitmentToStore, storedFitments) {
  const fitToStoreIds = getFitmentValuesIds(newFitmentToStore);
  return !!storedFitments.find(
    (storedFitment) => fitToStoreIds === getFitmentValuesIds(storedFitment)
  );
}

function getFitmentValuesIds(fitmentStore) {
  return fitmentStore.reduce((acc, item) => `${acc}-${item.value.id}`, '');
}
