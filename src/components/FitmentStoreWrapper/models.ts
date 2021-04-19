import React from 'react';
import { FitmentSelectorStore } from '../FitmentSelector/models';

export interface FitmentStoreWrapperProps {
  /**
   * Text for the Add new fitment button.
   */
  addButtonText?: string;
  /**
   * Class name  to override styles in this component.
   */
  className?: string;
  /**
   * Text for Clear all fitments button.
   */
  clearButtontext?: string;
  /**
   * HTML content to show when there are no saved filters.
   */
  htmlSection?: React.ElementType;
  /**
   * Maximun number of Fitments to show in the popover.
   */
  maxEntries?: number;
  /**
   * Callback fired when user clicks a saved fitment.
   */
  onFitmentClick?: (fitment: FitmentSelectorStore[]) => void;
  /**
   * Text to show in the component.
   */
  primaryTitle?: string;
  /**
   * Text to show in the component below the title.
   */
  subtitle?: string;
  /**
   * A react element or react node to show as icon on the left side.
   */
  primaryIcon?: React.ElementType | React.ReactNode;
  /**
   * The title for the popover
   */
  sectionTitle?: string;
  /**
   * If you want to use our default styles, set this property to `true`.
   */
  styled?: boolean;
}

export interface FitmentStorePopoverProps
  extends Pick<
    FitmentStoreWrapperProps,
    | 'sectionTitle'
    | 'clearButtontext'
    | 'maxEntries'
    | 'htmlSection'
    | 'addButtonText'
    | 'styled'
    | 'onFitmentClick'
  > {
  onAddFitment: () => void;
  list: [FitmentSelectorStore][];
  onRemoveFitment: (fitment: FitmentSelectorStore[]) => void;
}
