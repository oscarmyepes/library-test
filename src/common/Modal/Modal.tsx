import classnames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CrossIcon from '../../icons/CrossIcon';
import styles from './modal.scss';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  className?: string;
  backdropColor?: string;
}

const Modal = ({
  className,
  onClose,
  children,
  isOpen,
  backdropColor = '#000',
}: ModalProps) => {
  const domNode = React.useRef(null);
  const modalRef = React.useRef(null);
  const [, reRender] = React.useState({});

  React.useEffect(() => {
    const node = document.createElement('div');
    node.className = 'Sui-modal';
    domNode.current = document.body.appendChild(node);
    reRender({});

    return () => {
      document.body.removeChild(node);
    };
  }, []);

  React.useEffect(() => {
    if (domNode.current && modalRef.current && isOpen) {
      modalRef.current.focus();
    }
  }, [domNode.current, modalRef.current, isOpen]);

  const onModalKeyDown = (evt) => {
    if (evt.keyCode === 27 /* ESC */) {
      onClose();
    }
  };

  if (!domNode.current) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <div
        ref={modalRef}
        tabIndex={-1}
        role="presentation"
        className={classnames(
          styles.root,
          { [styles.hidden]: !isOpen },
          className,
          'Sui-Modal--root'
        )}
        onKeyDown={onModalKeyDown}
        onClick={() => null}
      >
        <div className={styles.modalDialog}>
          <button
            role="button"
            aria-label="close"
            className={classnames(styles.closeBtn, 'Sui-Modal--close-icon')}
            onClick={onClose}
          >
            <CrossIcon size={30} />
          </button>

          <div
            className={classnames(styles.modalContent, 'Sui-Modal--content')}
          >
            {children}
          </div>
        </div>
        <div
          role="presentation"
          tabIndex={-1}
          className={classnames(styles.backdrop, 'Sui-Modal--backdrop')}
          style={{ backgroundColor: backdropColor }}
          onClick={onClose}
          onKeyDown={() => null}
        ></div>
      </div>
    </>,
    domNode.current
  );
};

export default Modal;
