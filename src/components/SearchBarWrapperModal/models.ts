import { SearchBarWrapperProps } from '../SearchBarWrapper/models';

export interface SearchBarWrapperModalProps extends SearchBarWrapperProps {
  show: boolean;
  onClose: () => void;
}
