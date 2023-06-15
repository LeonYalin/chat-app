import { screen, fireEvent, waitFor } from '@testing-library/react';
import { createChat } from '@shared/models/chat.model';
import { renderWithProviders } from '@client/utils/test-utils';
import { AppDialogsProvider } from '@client/hooks/useDialog';
import { ChatHeaderUserMenu } from './ChatHeaderUserMenu';
import { createUser } from '@shared/models/user.model';

let mockChat: ReturnType<typeof createChat> | null = null;
let mockUser: ReturnType<typeof createUser> | null = null;
let mockOnSignOut: jest.Mock;
let mockOnUserDelete: jest.Mock;
let baseElement: HTMLElement;

beforeEach(() => {
  jest.clearAllMocks();
  mockChat = createChat({ name: 'test chat' });
  mockUser = createUser({ name: 'test user' });
  mockOnSignOut = jest.fn(chatId => {
    /**/
  });
  mockOnUserDelete = jest.fn((chatId, newName) => {
    /**/
  });
});

beforeEach(() => {
  baseElement = renderWithProviders(
    <AppDialogsProvider>
      <ChatHeaderUserMenu user={mockUser} onSignOut={mockOnSignOut} onUserDelete={mockOnUserDelete}></ChatHeaderUserMenu>
    </AppDialogsProvider>,
  ).baseElement;
});
it('should render successfully', () => {
  expect(baseElement).toBeTruthy();
});

it('should handle delele user correctly', async () => {
  const userMenuIcon = await screen.findByTestId('user-menu-icon');
  expect(userMenuIcon).toBeTruthy();
  fireEvent.click(userMenuIcon as Element);

  await waitFor(() => {
    expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).toBeVisible();
  });

  const deleteUserBtn = await screen.findByTestId('delete-user-btn');
  expect(deleteUserBtn).toBeTruthy();
  fireEvent.click(deleteUserBtn as Element);

  await waitFor(() => {
    expect(baseElement.getElementsByClassName('MuiDialog-root').item(0)).toBeVisible();
  });

  const confirmBtn = await screen.findByTestId('confirm-dialog-confirm-btn');
  expect(confirmBtn).toBeTruthy();
  fireEvent.click(confirmBtn as Element);

  expect(await screen.queryByTestId('confirm-dialog-cancel-btn')).not.toBeVisible();
  expect(mockOnUserDelete).toHaveBeenCalled();
});

it('should handle sign out correctly', async () => {
  const userMenuIcon = await screen.findByTestId('user-menu-icon');
  expect(userMenuIcon).toBeTruthy();
  fireEvent.click(userMenuIcon as Element);

  await waitFor(() => {
    expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).toBeVisible();
  });

  const signOutBtn = await screen.findByTestId('sign-out-btn');
  expect(signOutBtn).toBeTruthy();
  fireEvent.click(signOutBtn as Element);

  await waitFor(() => {
    expect(baseElement.getElementsByClassName('MuiDialog-root').item(0)).toBeVisible();
  });

  const confirmBtn = await screen.findByTestId('confirm-dialog-confirm-btn');
  expect(confirmBtn).toBeTruthy();
  fireEvent.click(confirmBtn as Element);

  expect(await screen.queryByTestId('confirm-dialog-cancel-btn')).not.toBeVisible();
  expect(mockOnSignOut).toHaveBeenCalled();
});
