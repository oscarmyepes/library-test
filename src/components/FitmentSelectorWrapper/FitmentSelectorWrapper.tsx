import debounce from 'lodash/debounce';
import * as React from 'react';
import useEventCallback from '../../common/customHooks/useEventCallback';
import { env } from '../../config';
import { Error } from '../../models/generic';
import restFactory from '../../utils/restFactory';
import FitmentSelector from '../FitmentSelector/FitmentSelector';
import {
  FitmentSelectorProps,
  Item,
  SelectedValues,
} from '../FitmentSelector/models';
import { FitmentSelectorWrapperProps } from './models';
import styles from './styles/fitmentSelectorWrapper.scss';

/*
  When the Fitment selector is used to show information related to one product,
  optional labels are not shown because we need all product information.
  Optional labels are only needed when user is in the landing or product list page to filter out 
  products in a more generic way.

  A filter must be passed to this component if we want to show data for a specific product
*/
export const PRODUCT_KEY = 'product';

const FitmentSelectorWrapper = ({
  autocommit,
  autocommitDelay = 2000,
  className = '',
  clearButtonText = 'Clear',
  components,
  filter = {},
  id,
  orientation = 'horizontal',
  onChange,
  onDataLoaded,
  onSubmit,
  searchButtonText = 'Search',
  selectedValues: initalSelectedValues = null,
  styled = false,
  onError,
}: FitmentSelectorWrapperProps) => {
  const [error, setError] = React.useState<Error>({ message: '' });
  const [labels, setLabels] = React.useState<Item[]>([]);
  const [optionalLabels, setOptionalLabels] = React.useState<Item[]>([]);
  const [labelsData, setLabelsData] = React.useState<
    FitmentSelectorProps['labelsData']
  >({});
  const [selectedValues, setSelectedValues] = React.useState<
    FitmentSelectorProps['selectedValues']
  >(initalSelectedValues);
  const loadingOptionalLabels = React.useRef(false);

  React.useEffect(() => {
    setSelectedValues(initalSelectedValues);
  }, [initalSelectedValues]);

  React.useEffect(() => {
    let isMounted = true;
    async function doCall() {
      const labelsResponse = await loadLabels(
        'fitment/labels',
        filter,
        setError
      );
      isMounted && setLabels(labelsResponse);

      const lastSelectedLabelIndex = Object.keys(initalSelectedValues || {})
        .length;

      let optionalLabelsResponse = [];
      if (
        lastSelectedLabelIndex >= labelsResponse.length &&
        !filter[PRODUCT_KEY]
      ) {
        optionalLabelsResponse = await loadLabels(
          'fitment/optionalLabels',
          filter,
          setError
        );
        isMounted && setOptionalLabels(optionalLabelsResponse);
      }

      const labelData = await loadLabelsData(
        [...labelsResponse, ...optionalLabelsResponse],
        lastSelectedLabelIndex,
        initalSelectedValues,
        filter,
        setError
      );

      if (isMounted) {
        setLabelsData(labelData);
      }
    }
    doCall();

    return () => {
      isMounted = false;
    };
  }, []);

  const debouncedDataLoaded = React.useCallback(
    debounce((labels, optionalLabels, labelsData) => {
      onDataLoaded(labels, optionalLabels, labelsData);
    }, 150 /* Magic number to don't call onDataLoaded multiple times and call with the last labels data */),
    []
  );

  React.useEffect(() => {
    if (onDataLoaded && (labels.length || Object.keys(labelsData).length)) {
      debouncedDataLoaded.cancel();
      debouncedDataLoaded(labels, optionalLabels, labelsData);
    }
  }, [labels, optionalLabels, labelsData]);

  React.useEffect(() => {
    if (onError && error.message) {
      onError(error);
    }
  }, [error]);

  const _onChange = async (
    labelId: number | string,
    values: SelectedValues
  ) => {
    if (!values && !labelId) {
      onClear();
      return;
    }
    const allLabels = [...labels, ...optionalLabels];
    const nextLabelIndex =
      allLabels.findIndex((item) => item.name === labelId) + 1;
    const hasNextLabel = nextLabelIndex < allLabels.length;
    const copiedValues = {
      ...values,
      ...(hasNextLabel ? { [allLabels[nextLabelIndex].name]: undefined } : {}),
    };
    const labelToClearData = allLabels.slice(nextLabelIndex);
    for (const key of labelToClearData) {
      delete copiedValues[key.name];
    }

    if (
      Object.keys(copiedValues).length === labels.length &&
      !filter[PRODUCT_KEY]
    ) {
      await loadOptionalLabels(values);
    } else if (Object.keys(copiedValues).length < labels.length) {
      setOptionalLabels([]);
    }

    if (hasNextLabel) {
      const nextLabelData = await loadLabelData(
        allLabels,
        nextLabelIndex,
        filter,
        values,
        setError
      );
      const newLabelsData = {
        ...labelsData,
        [allLabels[nextLabelIndex].name]: nextLabelData,
      };
      setLabelsData(newLabelsData);
    }

    setSelectedValues(copiedValues);
    onChange && onChange(labelId, values);
  };

  const onClear = () => {
    onChange?.(null, null);
    setSelectedValues({});
    setLabelsData({ [labels[0].name]: labelsData[labels[0].name] });
    setOptionalLabels([]);
  };

  const onSearch = useEventCallback(
    (values: SelectedValues) => {
      const allowSubmitAutocommit =
        Object.keys(selectedValues).length ===
        labels.length + optionalLabels.length;
      if (
        !loadingOptionalLabels.current &&
        ((autocommit && allowSubmitAutocommit) || !autocommit)
      ) {
        // This callback must be called only when user clicks Submit button,
        // or if autocommit is TRUE when all values are slected, including
        // optional labels
        onSubmit?.(values);
      }
    },
    [optionalLabels, selectedValues]
  );

  const loadOptionalLabels = async (selectedValues: SelectedValues) => {
    loadingOptionalLabels.current = true;
    const optionalLabelsResponse = await loadLabels(
      'fitment/optionalLabels',
      filter,
      setError
    );
    setOptionalLabels(optionalLabelsResponse);
    loadingOptionalLabels.current = false;
    const nextLabelData = (await restFactory.get(
      `${env.API_URL}/fitment/${optionalLabelsResponse[0].name.toLowerCase()}`,
      { ...filter, ...convertKeysToLowerCase(selectedValues) }
    )) as Item[];

    const newLabelsData = {
      ...labelsData,
      [optionalLabelsResponse[0].name]: nextLabelData,
    };
    setLabelsData(newLabelsData);
  };

  return error.message ? (
    <p className={styles.error}>{error.message}</p>
  ) : (
    <FitmentSelector
      autocommit={autocommit}
      autocommitDelay={autocommitDelay}
      className={className}
      clearButtonText={clearButtonText}
      id={id}
      orientation={orientation}
      onChange={_onChange}
      onSubmit={onSearch}
      searchButtonText={searchButtonText}
      styled={styled}
      components={components}
      labels={labels}
      optionalLabels={optionalLabels}
      labelsData={labelsData}
      selectedValues={selectedValues}
    />
  );
};

async function loadLabels(
  path: string,
  filter: FitmentSelectorWrapperProps['filter'],
  setError: React.Dispatch<React.SetStateAction<Error>>
) {
  try {
    const response = (await restFactory.get(
      `${env.API_URL}/${path}`,
      convertKeysToLowerCase(filter)
    )) as Item[];

    return response;
  } catch (error) {
    setError({ message: 'Error fetching list of labels' });
    return [];
  }
}

/**
 * When there are initial selected values, we need to fetch data for all selected labels plus
 * the next label data.
 * @param labels the list of all labels (dropdowns)
 * @param lastIndex Number of lables to fetch data, if inital selected labels are Year and Make, we
 * need here an index of 3 so fetch data for Year, Make and Model.
 */
async function loadLabelsData(
  labels: Item[],
  lastIndex: number,
  initalSelectedValues: FitmentSelectorWrapperProps['selectedValues'],
  filter: FitmentSelectorWrapperProps['filter'],
  setError: React.Dispatch<React.SetStateAction<Error>>
): Promise<FitmentSelectorProps['labelsData']> {
  const labelsToFetchData = labels.slice(
    0,
    Math.min(labels.length, lastIndex + 1)
  );
  let labelQuery = {};
  const promises: Array<Promise<Item[]>> = labelsToFetchData.map(
    (item, index) => {
      const prevLabelName = index ? labelsToFetchData[index - 1].name : null;
      if (index) {
        labelQuery = {
          ...labelQuery,
          [`${prevLabelName}`.toLowerCase()]: initalSelectedValues[
            `${prevLabelName}`
          ],
        };
      }
      const query = { ...filter, ...labelQuery };
      return restFactory.get(
        `${env.API_URL}/fitment/${item.name.toLowerCase()}`,
        query
      );
    }
  );
  try {
    const response = await Promise.all(promises);
    const result = labelsToFetchData.reduce(
      (acc, item, index) => ({ ...acc, [item.name]: response[index] }),
      {}
    );
    return result;
  } catch (error) {
    setError({ message: 'Error fetching label data' });
    return {};
  }
}

async function loadLabelData(
  labels: Item[],
  labelIndex: number,
  filter: FitmentSelectorWrapperProps['filter'],
  prevLabelValues: FitmentSelectorWrapperProps['selectedValues'],
  setError: React.Dispatch<React.SetStateAction<Error>>
): Promise<Item[]> {
  try {
    const response = (await restFactory.get(
      `${env.API_URL}/fitment/${labels[labelIndex].name.toLowerCase()}`,
      { ...filter, ...convertKeysToLowerCase(prevLabelValues) }
    )) as Item[];
    return response;
  } catch (error) {
    setError({ message: 'Error fetching label data' });
    return [];
  }
}

function convertKeysToLowerCase(obj: { [key: string]: string | number }) {
  return Object.entries(obj).reduce((acc, item) => {
    return { ...acc, [item[0].toLowerCase()]: item[1] };
  }, {});
}

export default FitmentSelectorWrapper;
