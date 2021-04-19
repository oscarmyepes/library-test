import classnames from 'classnames';
import * as React from 'react';
import Angle from '../../icons/Angle';
import TrashIcon from '../../icons/TrashIcon';
import { FitmentSelectorStore } from '../FitmentSelector/models';
import { FitmentStorePopoverProps } from './models';
import styles from './styles/fitmentStorePopover.scss';

const FitmentStorePopover = ({
  sectionTitle,
  clearButtontext,
  maxEntries,
  htmlSection,
  addButtonText,
  onAddFitment,
  onFitmentClick,
  onRemoveFitment,
  styled,
  list,
}: FitmentStorePopoverProps) => {
  const HtmlSection = htmlSection;

  const renderEmptyContent = () => {
    return typeof HtmlSection === 'function' ? <HtmlSection /> : htmlSection;
  };

  const listToShow = Array.isArray(list) ? list.slice(0, maxEntries) : [];

  return (
    <div
      className={classnames(styles.popover, {
        [styles.popoverStyled]: styled,
      })}
    >
      {listToShow.length ? (
        <>
          <div className={styles.popupHeader}>
            <h1 className="Sui-FitmentStore--popover-title">{sectionTitle}</h1>
            <button
              className={styles.clearAllBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFitment(null);
              }}
            >
              {clearButtontext}
            </button>
          </div>
          {listToShow.length ? (
            <ul className="Sui-FitmentStore--popover-list">
              {listToShow.map((item, index) => (
                <li key={index} role="listitem">
                  <div
                    className={styles.left}
                    tabIndex={0}
                    role="button"
                    onClick={() => onFitmentClick?.(item)}
                    onKeyDown={null}
                  >
                    <div className={styles.fitmentLabel}>
                      {getFitmentLabel(item)}
                    </div>
                    <Angle className={styles.angleIcon} />
                  </div>
                  <button
                    className={classnames(
                      styles.deletItemBtn,
                      'Sui-FitmentStore--delete-fitment-btn'
                    )}
                    aria-label="remove-fitment"
                    onClick={() => onRemoveFitment(item)}
                  >
                    <TrashIcon size={15} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      <div
        className={classnames(
          styles.footer,
          'Sui-FitmentStore--add-fitment-btn'
        )}
      >
        <button
          className={classnames({ 'SuiButton primary': styled })}
          onClick={onAddFitment}
        >
          {addButtonText}
        </button>
      </div>
      {!listToShow.length ? renderEmptyContent() : null}
    </div>
  );
};

export default FitmentStorePopover;

export function getFitmentLabel(fitment: FitmentSelectorStore[]) {
  return fitment.reduce((acc, item) => `${acc} ${item.value.name}`, '').trim();
}
