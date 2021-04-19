import { Meta } from '@storybook/react/types-6-0';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import LoadingIndicator from '../../../common/LoadingIndicator/LoadingIndicator';
import Modal from '../../../common/Modal/Modal';
import FitmentSelectorVerifier from '../../../components/FitmentSelectorVerifier/FitmentSelectorVerifier';
import { FitmentSelectorVerifierProps } from '../../../components/FitmentSelectorVerifier/models';
import FitmentSelectorWrapper from '../../../components/FitmentSelectorWrapper';
import styles from './styles.scss';

const initialSelectedData = {
  Make: 'ACURA',
  Model: 'CL',
  Submodel: 'BASE',
  Year: '2020',
};
const filter = { product: '123' };
// The height for each label (select + padding/margin) to calculate to total height of the modal
const labelHeight = 60;

const updateModalLoadingState = debounce((value, setShowModalLoading) => {
  setShowModalLoading(value);
}, 250);

export const Product = (args: FitmentSelectorVerifierProps) => {
  const initialSelectedLabels = args.selectedValues || initialSelectedData;
  const [showModal, setShowModal] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [modalFitmentData, setModalFitmentData] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState(initialSelectedLabels);

  const dataModalHasData = Object.keys(modalFitmentData || {}).length;

  useEffect(() => {
    if (showModal && !dataModalHasData) {
      updateModalLoadingState(true, setShowModalLoading);
    } else {
      updateModalLoadingState(false, setShowModalLoading);
    }
  }, [modalFitmentData, showModal]);

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <h1>BAKFLIP MX4 TONNEAU COVER</h1>
        <img
          alt="Product"
          src="https://www.titantruck.com/images/M3273410.jpeg"
        ></img>
      </div>
      <div className={styles.right}>
        <FitmentSelectorVerifier
          {...args}
          selectedValues={args.selectedValues || initialSelectedData}
          onShowMoreBtnClick={() => setShowModal(true)}
          filter={filter}
          onChange={(_, values) => setSelectedLabels(values)}
        />
      </div>

      <Modal
        className={classnames(styles.modal, {
          [styles.modalWithData]: dataModalHasData,
        })}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setModalFitmentData(null);
        }}
      >
        <p className={styles.modalTitle}>SELECT YOUR FITMENT</p>

        {showModal && (
          <div
            className={styles.modalContent}
            style={{
              height: getModalHeight(modalFitmentData),
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
              styled
              orientation="vertical"
              selectedValues={selectedLabels}
              // eslint-disable-next-line no-console
              onSubmit={(values) => console.log(values)}
              onDataLoaded={(labels, optionalLabels) => {
                setModalFitmentData({ labels, optionalLabels });
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

function getModalHeight(modalFitmentData) {
  const numberOfLabels =
    (modalFitmentData?.labels.length || 0) +
    (modalFitmentData?.optionalLabels.length || 0);

  const staticElementsHeight =
    55 + (modalFitmentData?.optionalLabels.length || 0 ? 59 : 0);

  return labelHeight * numberOfLabels + staticElementsHeight;
}

export default {
  component: Product,
  title: 'Pages/Product',
} as Meta;

Product.defaultProps = {
  autocommit: true,
  autocommitDelay: 500,
  orientation: 'vertical',
  showMoreText: "Don't see your vehicle listed?",
  styled: true,
  title: 'SELECT YOUR FITMENT',
};
