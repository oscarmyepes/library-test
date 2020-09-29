import * as React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

describe('test', () => {
  it('Should render header', () => {
    const { getByText } = render(<Header text="Header" />);

    expect(getByText('Header')).not.toBeUndefined();
  });
});
