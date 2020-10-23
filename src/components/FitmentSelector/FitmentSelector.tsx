import classnames from 'classnames';
import * as React from 'react';
import restFactory from '../../utils/restFactory';
import styles from './index.scss';
import { FitmentSelectorProps, Item } from './models';
import NativeSelect from './NativeSelect';
import {
  createEngineLabelData,
  createLabels,
  createMakeLabelData,
  createModelLabelData,
  createSubModelLabelData,
  createYearLabelData,
} from './__mocks__/labels';

const FitmentSelector = ({
  className = '',
  clearButtonText = 'Clear',
  id,
  orientation = 'horizontal',
  onChange,
  onSubmit,
  searchButtonText = 'Search',
  styled = false,
  components,
}: FitmentSelectorProps) => {
  const [labels, setLabels] = React.useState<Item[]>([]);
  const [labelValues, setLabelValue] = React.useState<number[]>([]);
  const [labelData, setLabelData] = React.useState<Item[][]>([]);

  React.useEffect(() => {
    async function doCall() {
      // const labelsResponse = (await restFactory.get('/labels')) as Label[];
      const labelsResponse = await getLabelList();
      setLabels(labelsResponse);
      // const yearLabelData = (await restFactory.get(
      //   `/${labelsResponse[0].name}`
      // )) as LabelData[];
      const yearLabelData = await getLabelData(labelsResponse[0].name);
      setLabelData([yearLabelData]);
    }
    doCall();
  }, []);

  /**
   * On every select change event we call the onChange function passed by user,
   * so user can track what labels have selected values and what the values are
   */
  React.useEffect(() => {
    if (onChange && labelValues.length) {
      const dataToExport = buildDataToExport(labels, labelData, labelValues);
      onChange(dataToExport);
    }
  }, [labelValues]);

  /**
   * Function to set the value for each label when user changes its value.
   * This function also clears the state of selected labels when a parent label changes
   * Example:
   * Year > Make > Model
   * If all selects have values and user selects a different Year, Make and Model selects must be reseted
   * @param labelIndex the index of the label that was cahnged
   * @param e html event
   */
  const onLabelChange = async (labelIndex: number, value: string | number) => {
    setLabelValue((state) => {
      // Copy orignal state to prevent mutations and clear labels that are on the right side
      const valuesCopy = [...state].slice(0, labelIndex);
      if (Number(value)) {
        valuesCopy[labelIndex] = Number(value);
      }
      return valuesCopy;
    });
    if (labelIndex < labels.length - 1) {
      // const nextLabelData = (await restFactory.get(
      //   `/${labels[labelIndex + 1].name}`
      // )) as LabelData[];
      const nextLabelData = await getLabelData(labels[labelIndex + 1].name);
      setLabelData((state) => {
        const labelDataCopy = [...state];
        labelDataCopy[labelIndex + 1] = nextLabelData;
        return labelDataCopy;
      });
    }
  };

  const onClear = () => setLabelValue([]);

  const onSearch = () => {
    if (onSubmit) {
      onSubmit(buildDataToExport(labels, labelData, labelValues));
    }
  };

  const isVertical = orientation === 'vertical';
  const CustomSelect = components?.select;

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
      {labels.map((label, index) =>
        CustomSelect ? (
          <CustomSelect
            key={label.id}
            value={labelValues[index] || ''}
            onChange={(e) => onLabelChange(index, e)}
            options={index > labelValues.length ? null : labelData[index]}
            label={label}
          />
        ) : (
          <NativeSelect
            key={label.id}
            onChange={(e) => onLabelChange(index, e.currentTarget.value)}
            value={labelValues[index] || ''}
            className="Sui-FitmentSelector--select"
            disabled={index > labelValues.length}
            name={label.name}
            options={
              labelData.length > index
                ? labelData[index].map((item) => ({
                    id: item.id,
                    name: item.name,
                  }))
                : []
            }
            styled={styled}
            isVertical={isVertical}
          />
        )
      )}
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
              [`SuiButton primary ${styles.StyledSearchBtn}`]: styled,
              [styles.StyledSearchBtnVertical]: styled && isVertical,
            },
            'Sui-FitmentSelector--searchBtn'
          )}
          disabled={labelValues.length === 0}
          onClick={onSearch}
        >
          {searchButtonText}
        </button>
        <button
          type="button"
          className={classnames(
            {
              [`SuiButton secondary ${styles.StyledClearBtn}`]: styled,
            },
            'Sui-FitmentSelector--clearBtn'
          )}
          onClick={onClear}
        >
          {clearButtonText}
        </button>
      </div>
    </div>
  );
};

export default FitmentSelector;

function buildDataToExport(labels, labelData, labelValues) {
  return labels.map((label, index) => ({
    ...label,
    value:
      labelData.length > index
        ? labelData[index][labelValues[index] - 1] || null
        : null,
  }));
}

// TODO configure fetch data using restfactory
/* tslint:disable */
const getLabelList = async () => await createLabels();

const getLabelData = async (labelName: string): Promise<Item[]> => {
  switch (labelName) {
    case 'Year':
      return await createYearLabelData();
    case 'Make':
      return await createMakeLabelData();
    case 'Model':
      return await createModelLabelData();
    case 'Submodel':
      return await createSubModelLabelData();
    case 'Engine':
      return await createEngineLabelData();
  }
};

/* tslint:enable */
