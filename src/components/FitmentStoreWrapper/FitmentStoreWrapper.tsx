import debounce from 'lodash/debounce';
import classnames from 'classnames';
import * as React from 'react';
import FitmentSelectorWrapperModal from '../../common/FitmentSelectorWrapperModal/FitmentSelectorWrapperModal';
import List from '../../icons/List';
import { FITMENT_SELECTOR_STORAGE_KEY } from '../../utils/constants';
import FitmentStorePopover from './FitmentStorePopover';
import { FitmentStorePopoverProps, FitmentStoreWrapperProps } from './models';
import styles from './styles/fitmentStore.scss';

const DEFAULT_CONTENT = () => (
  <div className={styles.noDataContainer}>
    <h3>Store vehicles in you garage</h3>
  </div>
);

const FitmentStoreWrapper = ({
  addButtonText = 'Add vehicle',
  clearButtontext = 'Clear all',
  htmlSection,
  maxEntries = 3,
  primaryIcon,
  primaryTitle = 'My Fitment Store',
  sectionTitle = 'My Garage',
  onFitmentClick,
  styled,
  className,
  subtitle,
}: FitmentStoreWrapperProps) => {
  const [list, setList] = React.useState<FitmentStorePopoverProps['list']>([]);
  const [showPopover, setShowPopover] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setList(
      JSON.parse(localStorage.getItem(FITMENT_SELECTOR_STORAGE_KEY) || '[]')
    );
  };

  const onRemoveFitment = (item) => {
    let newList = [];
    if (item) {
      newList = list.filter((fitment) => fitment !== item);
    }
    setList(newList);
    localStorage.setItem(FITMENT_SELECTOR_STORAGE_KEY, JSON.stringify(newList));
  };

  const showAddFitmentModal = () => {
    setShowModal(true);
    setShowPopover(false);
  };

  const onFitmentSelected = (item) => {
    onFitmentClick?.(item);
  };

  const debouncedTogglePopover = React.useCallback(
    debounce((visible: boolean) => {
      setShowPopover(visible);
    }, 150),
    []
  );

  const togglePopover = (visible: boolean) => {
    if (showModal) {
      debouncedTogglePopover(false);
    } else {
      debouncedTogglePopover(visible);
    }
  };

  return (
    <div
      className={classnames(styles.root, className)}
      onMouseEnter={() => togglePopover(true)}
      onMouseLeave={() => togglePopover(false)}
    >
      <div className={classnames(styles.title, styles.ellipsis)}>
        <div className={styles.iconContainer}>
          {list.length ? (
            <span
              className={classnames(styles.counter, {
                [styles.styledCounter]: styled,
              })}
            >
              {list.length > maxEntries ? maxEntries : list.length}
            </span>
          ) : null}
          {primaryIcon || <List />}
        </div>
        <h1 className="Sui-FitmentStore--title">
          {primaryTitle}
          {subtitle ? (
            <p
              className={classnames(
                styles.subtitle,
                styles.ellipsis,
                'Sui-FitmentStore--subtitle'
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </h1>
      </div>
      <div
        className={classnames(
          styles.popoverContainer,
          {
            [styles.showPopover]: showPopover,
            [styles.styledPopoverContainer]: styled,
          },
          'Sui-FitmentStore--popover-container'
        )}
        onMouseEnter={() => togglePopover(true)}
        onMouseLeave={() => togglePopover(false)}
      >
        <FitmentStorePopover
          styled={styled}
          sectionTitle={sectionTitle}
          clearButtontext={clearButtontext}
          maxEntries={maxEntries}
          htmlSection={getValidHtmlSection(htmlSection)}
          addButtonText={addButtonText}
          onAddFitment={showAddFitmentModal}
          onFitmentClick={onFitmentSelected}
          onRemoveFitment={onRemoveFitment}
          list={list}
        />
      </div>

      <FitmentSelectorWrapperModal
        show={showModal}
        close={() => setShowModal(false)}
        styled={styled}
        onSubmit={() => {
          refreshList();
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default FitmentStoreWrapper;

function getValidHtmlSection(htmlSection) {
  const htmlSectionType = typeof htmlSection;
  return React.isValidElement(htmlSection) || htmlSectionType === 'function'
    ? htmlSection
    : DEFAULT_CONTENT;
}
