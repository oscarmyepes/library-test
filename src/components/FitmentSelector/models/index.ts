export interface CustomSelect {
  value: string | number;
  onChange?: (value: string | number) => void;
  options: Item[];
  label: Item;
}
export interface FitmentSelectorProps {
  className?: string;
  clearButtonText?: string;
  id?: string;
  orientation?: 'horizontal' | 'vertical';
  searchButtonText?: string;
  styled?: boolean;
  onChange?: (values: SelectedValues[]) => void;
  onSubmit?: (values: SelectedValues[]) => void;
  components?: {
    select?: React.ElementType<CustomSelect>;
  };
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
  id: number;
  name: string;
  priority: number;
}

export interface SelectedValues extends Item {
  value: Item;
}
