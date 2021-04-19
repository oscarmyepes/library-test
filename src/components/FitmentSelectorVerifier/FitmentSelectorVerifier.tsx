import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import useEventCallback from '../../common/customHooks/useEventCallback';
import { Error } from '../../models/generic';
import { validateSelectedValues } from '../../utils/fitmentValidator';
import Alert from '../Alert';
import {
  FitmentSelectorProps,
  Item,
  SelectedValues,
} from '../FitmentSelector/models';
import FitmentSelectorWrapper from '../FitmentSelectorWrapper';
import { FitmentSelectorVerifierProps } from './models';
import styles from './styles/fitmentVerifier.scss';

interface AlertType {
  type: '' | 'success' | 'error';
  visible: boolean;
}

const FitmentSelectorVerifier = ({
  selectedValues,
  showMoreText,
  onShowMoreBtnClick,
  title,
  alertSuccessTitle = 'FITMENT VERIFIED FOR:',
  alertErrorTitle = "DOESN'T FIT:",
  alertButtonText = 'Change vehicle',
  alertFill,
  showAlertIcon,
  ...fitmentWrapperProps
}: FitmentSelectorVerifierProps) => {
  const isMounted = useRef(true);
  const [alert, setAlert] = useState<AlertType>({ type: '', visible: false });
  const [isFitmentDataLoaded, setIsFitmentDataLoaded] = useState(false);
  const [
    selectedFitmentData,
    setSelectedFitmentData,
  ] = useState<SelectedValues>(selectedValues);
  const [fitmentError, setFitmentError] = useState<Error>();
  const labels = useRef([]);
  const labelsData = useRef({});

  useEffect(() => () => (isMounted.current = false), []);

  useEffect(() => {
    if (selectedFitmentData !== selectedValues) {
      setSelectedFitmentData(selectedValues);
      if (alert.visible) {
        const validLabels = validateSelectedValues(
          selectedValues,
          labelsData.current,
          labels.current
        );
        const areLabelsValid = areLabelValuesValid(labels.current, validLabels);
        setAlert({ type: areLabelsValid ? 'success' : 'error', visible: true });
      }
    }
  }, [selectedValues]);

  const onFitmentDataLoaded = useEventCallback(
    (
      _labels: Item[],
      _optionalLabels: Item[],
      _labelsData: FitmentSelectorProps['labelsData']
    ) => {
      if (!isMounted.current) return;
      setFitmentError(null);
      labels.current = [..._labels, ..._optionalLabels];
      labelsData.current = _labelsData;
      if (
        [..._labels, ..._optionalLabels].length ===
        Object.keys(selectedFitmentData).length
      ) {
        const selectedLabels = Object.keys(
          validateSelectedValues(selectedFitmentData, _labelsData, _labels)
        ).length;
        if (!selectedLabels) {
          setAlert({ type: '', visible: false });
        } else if (Object.keys(labels.current).length > selectedLabels) {
          setAlert({ type: 'error', visible: true });
        } else if (Object.keys(labels.current).length === selectedLabels) {
          setAlert({ type: 'success', visible: true });
        }
      } else if (
        // This conditional only happens when user hasn't changed the initial selection (first render)
        // and there is not enough data for the fitment
        selectedValues === selectedFitmentData &&
        Object.keys(selectedValues).length &&
        [..._labels, ..._optionalLabels].length !==
          Object.keys(selectedFitmentData).length
      ) {
        setAlert({ type: 'error', visible: true });
      }
      setIsFitmentDataLoaded(Object.keys(_labelsData).length > 0);
    },
    [selectedFitmentData]
  );

  const onSubmit = (values) => {
    const areAllLabelsSelected = areLabelValuesValid(labels.current, values);
    if (!fitmentWrapperProps.autocommit || areAllLabelsSelected) {
      setAlert({
        type: areAllLabelsSelected ? 'success' : 'error',
        visible: true,
      });
    }

    fitmentWrapperProps?.onSubmit?.(values);
  };

  const alertClick = () => {
    setAlert({ type: '', visible: false });
  };

  return (
    <div
      className={classnames(styles.root, 'Sui-FitmentSelectorVerifier--root')}
    >
      <Alert
        type={alert.type === 'error' ? 'error' : 'success'}
        title={alert.type === 'error' ? alertErrorTitle : alertSuccessTitle}
        text={fitmentToString(
          labels.current,
          selectedFitmentData,
          labelsData.current
        )}
        onClick={alertClick}
        buttonText={alertButtonText}
        fill={alertFill}
        showIcon={showAlertIcon}
        styled={fitmentWrapperProps.styled}
        style={{ display: !alert.visible ? 'none' : '' }}
      />
      <div
        data-testid="fitment-verifier-selectors"
        style={{ display: alert.visible || !isFitmentDataLoaded ? 'none' : '' }}
      >
        {title && (
          <p
            className={classnames(
              styles.fitmentTitle,
              'Sui-FitmentSelectorVerifier--title'
            )}
          >
            {title}
          </p>
        )}
        <div className={styles.fitment}>
          <FitmentSelectorWrapper
            {...fitmentWrapperProps}
            onSubmit={onSubmit}
            onChange={(_, values) => {
              setSelectedFitmentData(values || {});
              fitmentWrapperProps?.onChange?.(_, values);
            }}
            onDataLoaded={onFitmentDataLoaded}
            onError={(err) => {
              setIsFitmentDataLoaded(true);
              setFitmentError(err);
            }}
            selectedValues={selectedFitmentData}
          />
          {showMoreText && onShowMoreBtnClick && !fitmentError ? (
            <button
              className={styles.searchVehicleBtn}
              onClick={onShowMoreBtnClick}
            >
              {showMoreText}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

function fitmentToString(
  labels: Item[],
  selectedFitmentData: SelectedValues,
  labelsData: FitmentSelectorProps['labelsData']
) {
  let text = '';
  if (
    labels.length &&
    Object.keys(selectedFitmentData).length &&
    Object.keys(labelsData).length
  ) {
    for (const item of labels) {
      const labelValue = selectedFitmentData[item.name];
      if (labelValue) {
        const labeldDataMatch = (labelsData[item.name] || []).find(
          (item) => String(item.id) === String(labelValue)
        );
        if (!labeldDataMatch) {
          text =
            'There is an error on your Fitment selection, please try again.';
          break;
        }
        text += ` ${labeldDataMatch.name}`;
      }
    }
  }
  return text.trim();
}

function areLabelValuesValid(labels: Item[], selectedValues: SelectedValues) {
  return (
    Object.keys(labels).length ===
    Object.values(selectedValues).filter((value) => value).length
  );
}

export default FitmentSelectorVerifier;
