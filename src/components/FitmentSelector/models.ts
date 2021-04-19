import { FitmentSelectorWrapperProps } from '../FitmentSelectorWrapper/models';

export interface CustomSelect {
  value: string | number;
  onChange?: (value: string | number) => void;
  options: Item[];
  label: Item;
}

export interface FitmentSelectorProps
  extends Omit<FitmentSelectorWrapperProps, 'filter' | 'onDataLoaded'> {
  /**
   * Array of labels to show.
   */
  labels: Array<Item>;
  /**
   * Selects for these optional labels will be shown whe user selects the last label,
   * in that way we know what optional labels the selected vehicle has.
   */
  optionalLabels?: Array<Item>;
  /**
   * Title for optional labels section
   */
  optionalLabelsTitle?: string;
  /**
   * Object containing an array of options for each label.
   *
   * Each property name should be the name of the label.
   */
  labelsData: { [key: string]: Array<Item> };
}

export interface NativeSelectProps {
  className?: string;
  styled?: boolean;
  isVertical?: boolean;
  options: {
    name: string;
    id: number | string;
  }[];
  value: string | number;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
}

export interface Item {
  id: number | string;
  name: string;
  priority?: number;
}

export interface SelectedValues {
  [key: string]: number | string;
}

export interface FitmentSelectorStore {
  label: Item;
  value: Item;
}
