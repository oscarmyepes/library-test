import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import Alert from './Alert';
import styles from './styles/alert.scss';

describe('Alert', () => {
  it('Should show alert with title, text and no button', async () => {
    const { findByText, queryByRole } = render(
      <Alert type="success" title="Title" text="text" />
    );

    await findByText('Title');
    await findByText('text');
    expect(queryByRole('button')).toBeNull();
  });

  it('Should show alert with button and call onClick function when button it is clicked', async () => {
    const onClick = jest.fn();
    const { findByRole } = render(
      <Alert
        type="success"
        title="Title"
        text="text"
        onClick={onClick}
        buttonText="Change"
      />
    );

    const button = await findByRole('button');
    fireEvent.click(button);
    expect(button.textContent).toBe('Change');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Should set class depending on alert type', async () => {
    const { container, rerender } = render(
      <Alert type="success" title="Title" />
    );
    expect(container.querySelector(`.${styles.success}`)).not.toBeNull();

    rerender(<Alert type="warning" title="Title" />);
    expect(container.querySelector(`.${styles.warning}`)).not.toBeNull();

    rerender(<Alert type="error" title="Title" />);
    expect(container.querySelector(`.${styles.error}`)).not.toBeNull();
  });

  it('Should render title and text as React.Node', async () => {
    const { findByTestId } = render(
      <Alert
        type="success"
        title={<h1 data-testid="title">Title</h1>}
        text={<p data-testid="text">text</p>}
      />
    );

    await findByTestId('title');
    await findByTestId('text');
  });
});
