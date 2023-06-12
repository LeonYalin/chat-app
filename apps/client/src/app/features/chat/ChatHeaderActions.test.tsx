import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatHeaderActions } from './ChatHeaderActions';
import { createChat } from '@shared/models/chat.model';
import { renderWithProviders } from '@client/utils/test-utils';
import { ConfirmDialogProvider } from '@client/hooks/useConfirm';

let mockChat: ReturnType<typeof createChat> | null = null;
let onSignOut: jest.Mock;
let onUserDelete: jest.Mock;
let baseElement: HTMLElement;

beforeEach(() => {
  jest.clearAllMocks();
  mockChat = createChat({ name: 'test chat' });
  onSignOut = jest.fn(() => {
    /**/
  });
  onUserDelete = jest.fn(() => {
    /**/
  });
});

beforeEach(() => {
  baseElement = renderWithProviders(
    <ConfirmDialogProvider>
      <ChatHeaderActions chat={mockChat} onChatDelete={onSignOut} onChatNameChange={onUserDelete} />
    </ConfirmDialogProvider>,
  ).baseElement;
});
it('should render successfully', () => {
  expect(baseElement).toBeTruthy();
});

it('should show correct chat name', () => {
  expect(screen.queryByText('test chat')).toBeTruthy();
});

it('should handle edit chat name correctly', () => {
  const editBtn = screen.getByTestId('edit-chat-name-btn');
  expect(editBtn).toBeTruthy();
  fireEvent.click(editBtn as Element);
  expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).toBeVisible();

  const input = screen.getByTestId('input-chat-name-edit');
  expect(input).toBeTruthy();
  fireEvent.input(input as Element, { target: { value: '123' } });
  expect((input as HTMLInputElement).value).toEqual('123');

  const saveBtn = screen.queryByTestId('chat-name-edit-submit');
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn as Element);
  expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).not.toBeVisible();
  expect(onUserDelete).toHaveBeenCalledWith(mockChat?.id, '123');
});

it('should handle delete chat correctly', async () => {
  const deleteBtn = await screen.findByTestId('delete-btn');
  expect(deleteBtn).toBeTruthy();
  fireEvent.click(deleteBtn as Element);
  await waitFor(() => {
    expect(baseElement.getElementsByClassName('MuiDialog-root').item(0)).toBeVisible();
  });

  const confirmBtn = await screen.findByTestId('confirm-dialog-confirm-btn');
  expect(confirmBtn).toBeTruthy();
  fireEvent.click(confirmBtn as Element);

  expect(await screen.queryByTestId('confirm-dialog-cancel-btn')).not.toBeVisible();
  expect(onSignOut).toHaveBeenCalledWith(mockChat?.id);
});
