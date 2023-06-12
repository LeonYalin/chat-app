import { renderWithProviders } from '@client/utils/test-utils';
import { ChatHeader } from './ChatHeader';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createChat } from '@shared/models/chat.model';
import { ConfirmDialogProvider } from '@client/hooks/useConfirm';
import { createUser } from '@shared/models/user.model';

let mockChat: ReturnType<typeof createChat> | null = null;
let mockUser: ReturnType<typeof createUser> | null = null;
let mockOnChatDelete: jest.Mock;
let mockOnChatNameChange: jest.Mock;
let mockOnSignOut: jest.Mock;
let mockOnUserDelete: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockChat = createChat({ name: 'test chat' });
  mockUser = createUser({ name: 'test user' });
  mockOnChatDelete = jest.fn(chatId => {
    /**/
  });
  mockOnChatNameChange = jest.fn((chatId, newName) => {
    /**/
  });
  mockOnSignOut = jest.fn(() => {
    /** */
  });
  mockOnUserDelete = jest.fn(() => {
    /** */
  });
});

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(
    <ChatHeader
      chat={mockChat}
      user={mockUser}
      onChatDelete={mockOnChatDelete}
      onChatNameChange={mockOnChatNameChange}
      onSignOut={mockOnSignOut}
      onUserDelete={mockOnUserDelete}
    />,
  );
  expect(baseElement).toBeTruthy();
});

// it('should handle delele user correctly', async () => {
//   const { baseElement } = renderWithProviders(
//     <ChatHeader
//       chat={mockChat}
//       user={mockUser}
//       onChatDelete={mockOnChatDelete}
//       onChatNameChange={mockOnChatNameChange}
//       onSignOut={mockOnSignOut}
//       onUserDelete={mockOnUserDelete}
//     />,
//   );

//   const userMenuIcon = await screen.findByTestId('user-menu-icon');
//   expect(userMenuIcon).toBeTruthy();
//   fireEvent.click(userMenuIcon as Element);

//   await waitFor(() => {
//     expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).toBeVisible();
//   });

//   const deleteUserBtn = await screen.findByTestId('delete-user-btn');
//   expect(deleteUserBtn).toBeTruthy();
//   fireEvent.click(deleteUserBtn as Element);

//   await waitFor(() => {
//     expect(baseElement.getElementsByClassName('MuiDialog-root').item(0)).toBeVisible();
//   });

//   const confirmBtn = await screen.findByTestId('confirm-dialog-confirm-btn');
//   expect(confirmBtn).toBeTruthy();
//   fireEvent.click(confirmBtn as Element);

//   expect(await screen.queryByTestId('confirm-dialog-cancel-btn')).not.toBeVisible();
//   expect(mockOnUserDelete).toHaveBeenCalled();
// });

// it('should handle sign out correctly', async () => {
//   const { baseElement } = renderWithProviders(
//     <ConfirmDialogProvider>
//       <ChatHeader
//         chat={mockChat}
//         user={mockUser}
//         onChatDelete={mockOnChatDelete}
//         onChatNameChange={mockOnChatNameChange}
//         onSignOut={mockOnSignOut}
//         onUserDelete={mockOnUserDelete}
//       />
//     </ConfirmDialogProvider>,
//   );

//   const userMenuIcon = await screen.findByTestId('user-menu-icon');
//   expect(userMenuIcon).toBeTruthy();
//   fireEvent.click(userMenuIcon as Element);

//   await waitFor(() => {
//     expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).toBeVisible();
//   });

//   const signOutBtn = await screen.findByTestId('sign-out-btn');
//   expect(signOutBtn).toBeTruthy();
//   fireEvent.click(signOutBtn as Element);

//   await waitFor(() => {
//     expect(baseElement.getElementsByClassName('MuiDialog-root').item(0)).toBeVisible();
//   });

//   const confirmBtn = await screen.findByTestId('confirm-dialog-confirm-btn');
//   expect(confirmBtn).toBeTruthy();
//   fireEvent.click(confirmBtn as Element);

//   expect(await screen.queryByTestId('confirm-dialog-cancel-btn')).not.toBeVisible();
//   expect(mockOnSignOut).toHaveBeenCalled();
// });
