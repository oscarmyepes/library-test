import classnames from 'classnames';
import * as React from 'react';
import Modal from '../../common/Modal/Modal';
import SearchBarWrapper from '../SearchBarWrapper/SearchBarWrapper';
import { SearchBarWrapperModalProps } from './models';
import styles from './style.scss';

const SearchBarWrapperModal = ({
  show,
  onClose,
  className,
  ...searchWrapperProps
}: SearchBarWrapperModalProps) => {
  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      className={classnames(styles.searchBarModal, className)}
    >
      <SearchBarWrapper {...searchWrapperProps}></SearchBarWrapper>
    </Modal>
  );
};

export default SearchBarWrapperModal;
