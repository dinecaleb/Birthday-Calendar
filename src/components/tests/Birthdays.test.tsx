import { render, screen } from '@testing-library/react';

import React from 'react';
import Birthdays from '../Birthdays';

test('renders the birthday component', () => {
  render(<Birthdays />);
  const inputSearch = screen.getByRole('textbox')

  expect(inputSearch).toBeInTheDocument();
});