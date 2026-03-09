import { render, screen } from '@testing-library/react';
import App from './App';

test('renders map mode buttons', () => {
  render(<App />);
  // the default mode button should be present in the header
  const defaultButton = screen.getByText(/default/i);
  expect(defaultButton).toBeInTheDocument();
});
