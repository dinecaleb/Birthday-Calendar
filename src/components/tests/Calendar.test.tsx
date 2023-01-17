import { render, screen } from '@testing-library/react';

import React from 'react';
import Calendar from '../Calendar';

test('renders the calendar component', () => {
  render(<Calendar />);
  const calendarTitle = screen.getByText(/Birthday Calendar/i)
  const calendarInstruction = screen.getByText(/Select a date to view birthdays/i)
  expect(calendarTitle).toBeInTheDocument();
  expect(calendarInstruction).toBeInTheDocument();
});