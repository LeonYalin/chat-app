import { EmptyState } from './EmptyState';
import { renderWithProviders } from '../utils/test-utils';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { screen } from '@testing-library/react';
import { Button } from '@mui/material';

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(<EmptyState />);
  expect(baseElement).toBeTruthy();
});

it('should have right icon and messages', () => {
  const messages = ['first message', 'second message'];
  renderWithProviders(<EmptyState icon={<ChatBubbleOutlineIcon />} messages={messages} />);
  expect(screen.queryByTestId('ChatBubbleOutlineIcon')).toBeTruthy();
  expect(screen.queryByText(messages[0])).toBeTruthy();
  expect(screen.queryByText(messages[1])).toBeTruthy();
});

it('should render children successfully', () => {
  renderWithProviders(
    <EmptyState>
      <Button data-testid="injectedbtn">Add Chat</Button>
    </EmptyState>,
  );
  const btn = screen.queryByTestId('injectedbtn');
  expect(btn).toHaveTextContent('Add Chat');
});
