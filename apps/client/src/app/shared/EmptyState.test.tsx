import { EmptyState } from './EmptyState';
import { renderWithProviders } from '../utils/test-utils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { screen } from '@testing-library/react';

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(<EmptyState />);
  expect(baseElement).toBeTruthy();
});

it('should have the right icon', () => {
  renderWithProviders(<EmptyState icon={<ChatBubbleOutlineIcon />} />);
  expect(screen.queryByTestId('ChatBubbleOutlineIcon1')).toBeTruthy();
});
