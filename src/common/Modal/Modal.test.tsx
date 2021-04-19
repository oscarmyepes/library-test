import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import Modal from './Modal';
import styles from './modal.scss';

describe('Modal', () => {
  const DEFAULT_CONTENT = <div>Content</div>;

  it('Should render modal hidden', async () => {
    const { findByText } = render(
      <Modal isOpen={false} onClose={() => null}>
        {DEFAULT_CONTENT}
      </Modal>
    );

    await findByText('Content');
    expect(
      screen.getAllByRole('presentation')[0].className.includes(styles.hidden)
    ).toBeTruthy();
  });

  it('Should render modal visible', async () => {
    const { findByText } = render(
      <Modal isOpen={true} onClose={() => null}>
        {DEFAULT_CONTENT}
      </Modal>
    );

    await findByText('Content');
    expect(
      screen.getAllByRole('presentation')[0].className.includes(styles.hidden)
    ).toBeFalsy();
  });

  it('Should call onClose function when user hits ESC key', async () => {
    const onClose = jest.fn();
    const { findAllByRole } = render(
      <Modal isOpen={true} onClose={onClose}>
        {DEFAULT_CONTENT}
      </Modal>
    );

    // Modal root and backdrop
    const modalParents = await findAllByRole('presentation');
    expect(modalParents).toHaveLength(2);
    fireEvent.keyDown(modalParents[0], { keyCode: 27 });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('Should close the modal when Close button is clicked', async () => {
    const onClose = jest.fn();
    const { findByRole } = render(
      <Modal isOpen={false} onClose={onClose}>
        {DEFAULT_CONTENT}
      </Modal>
    );
    const closeBtn = await findByRole('button');
    fireEvent.click(closeBtn);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
