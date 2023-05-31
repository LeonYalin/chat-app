import { renderWithProviders } from '@client/utils/test-utils';
import { ChatHeader } from './ChatHeader';
import { createChat } from './chat.model';
import { fireEvent, screen, waitFor } from '@testing-library/react';

let mockChat: ReturnType<typeof createChat> | null = null;
let mockOnChatDelete: jest.Mock;
let mockOnChatNameChange: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockChat = createChat({ name: 'test chat' });
  mockOnChatDelete = jest.fn(chatId => {
    /**/
  });
  mockOnChatNameChange = jest.fn((chatId, newName) => {
    /**/
  });
});

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(
    <ChatHeader chat={mockChat} onChatDelete={mockOnChatDelete} onChatNameChange={mockOnChatNameChange} />,
  );
  expect(baseElement).toBeTruthy();
});

it('should show correct chat name', () => {
  renderWithProviders(<ChatHeader chat={mockChat} onChatDelete={mockOnChatDelete} onChatNameChange={mockOnChatNameChange} />);
  expect(screen.queryByText('test chat')).toBeTruthy();
});

it('should handle edit chat name correctly', () => {
  const mockChat = createChat({ name: 'test chat' });
  const { baseElement } = renderWithProviders(
    <ChatHeader chat={mockChat} onChatDelete={mockOnChatDelete} onChatNameChange={mockOnChatNameChange} />,
  );

  // find edit button
  const editBtn = screen.getByTestId('edit-btn');
  expect(editBtn).toBeTruthy();

  // click edit button, open popover
  fireEvent.click(editBtn as Element);
  expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).toBeVisible();

  // find input, fill in new name
  const input = screen.getByTestId('chat-name-edit');
  expect(input).toBeTruthy();
  fireEvent.input(input as Element, { target: { value: '123' } });
  expect((input as HTMLInputElement).value).toEqual('123');

  // find save button, click it
  const saveBtn = screen.queryByTestId('chat-name-edit-submit');
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn as Element);

  // check if callback is called
  expect(baseElement.getElementsByClassName('MuiPopover-paper').item(0)).not.toBeVisible();
  expect(mockOnChatNameChange).toHaveBeenCalledWith(mockChat.id, '123');
});

it('should handle delete chat correctly', () => {
  const { baseElement } = renderWithProviders(
    <ChatHeader chat={mockChat} onChatDelete={mockOnChatDelete} onChatNameChange={mockOnChatNameChange} />,
  );

  // find delete button
  const deleteBtn = screen.getByTestId('delete-btn');
  expect(deleteBtn).toBeTruthy();

  // click delete button, open dialog
  fireEvent.click(deleteBtn as Element);
  waitFor(() => {
    expect(baseElement.getElementsByClassName('MuiDialog-root').item(0)).toBeVisible();

    // find dialog confirm delete button, click it
    const confirmBtn = screen.queryByTestId('chat-delete-confirm');
    expect(confirmBtn).toBeTruthy();
    fireEvent.click(confirmBtn as Element);

    // check if callback is called
    expect(screen.queryByTestId('confirm-dialog-cancel-btn')).not.toBeVisible();
    expect(mockOnChatDelete).toHaveBeenCalledWith(mockChat?.id);
  });
});
