import classnames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import FitmentSelectorWrapper from '../../components/FitmentSelectorWrapper';
import { FitmentSelectorWrapperProps } from '../../components/FitmentSelectorWrapper/models';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import Modal from '../Modal/Modal';
import styles from './fitmentSelectorWrapperModal.scss';

interface FitmentSelectorWrapperModalProps
  extends Pick<FitmentSelectorWrapperProps, 'onSubmit'> {
  show: boolean;
  close: () => void;
  styled: boolean;
}

// The height for each label (select + padding/margin) to calculate to total height of the modal
const labelHeight = 60;

const updateModalLoadingState = debounce((value, setShowModalLoading) => {
  setShowModalLoading(value);
}, 250);

const FitmentSelectorWrapperModal = ({
  show,
  close,
  styled,
  onSubmit,
}: FitmentSelectorWrapperModalProps) => {
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [modalFitmentData, setModalFitmentData] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState({});

  const dataModalHasData = Object.keys(modalFitmentData || {}).length;

  useEffect(() => {
    setModalFitmentData(null);
    setSelectedLabels({});
  }, [show]);

  useEffect(() => {
    if (show && !dataModalHasData) {
      updateModalLoadingState(true, setShowModalLoading);
    } else {
      updateModalLoadingState(false, setShowModalLoading);
    }
  }, [modalFitmentData, show]);

  return (
    <Modal
      className={classnames(styles.modal, {
        [styles.modalWithData]: dataModalHasData,
      })}
      isOpen={show}
      onClose={() => {
        close();
        setModalFitmentData(null);
      }}
    >
      <p className={styles.modalTitle}>SELECT YOUR FITMENT</p>

      {show && (
        <div
          className={styles.modalContent}
          style={{
            height: styled ? getModalHeight(modalFitmentData) : 'fit-content',
          }}
        >
          {showModalLoading && (
            <div
              className={classnames({
                [styles.hidden]: dataModalHasData,
              })}
            >
              <LoadingIndicator type="circular" />
            </div>
          )}
          <FitmentSelectorWrapper
            className={classnames({
              [styles.hidden]: !dataModalHasData,
            })}
            styled={styled}
            orientation="vertical"
            selectedValues={selectedLabels}
            onChange={(_, values) => setSelectedLabels(values)}
            onDataLoaded={(labels, optionalLabels) => {
              setModalFitmentData({ labels, optionalLabels });
            }}
            onSubmit={onSubmit}
          />
        </div>
      )}
    </Modal>
  );
};

export default FitmentSelectorWrapperModal;

function getModalHeight(modalFitmentData) {
  const numberOfLabels =
    (modalFitmentData?.labels.length || 0) +
    (modalFitmentData?.optionalLabels.length || 0);

  const staticElementsHeight =
    55 + (modalFitmentData?.optionalLabels.length || 0 ? 59 : 0);

  return labelHeight * numberOfLabels + staticElementsHeight;
}
