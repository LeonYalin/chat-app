import { renderWithProviders } from '@client/utils/test-utils';
import { ChatRoom } from './ChatRoom';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { Chat, createChat } from '@shared/models/chat.model';

let mockChat: Chat | null = null;
let mockPanelWidth = 0;
let mockOnChatMessage: jest.Mock;
let mockOnChatDelete: jest.Mock;
let mockOnChatNameChange: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockPanelWidth = 0;
  mockOnChatMessage = jest.fn(msg => {
    /**/
  });
  mockOnChatDelete = jest.fn(chatId => {
    /**/
  });
  mockOnChatNameChange = jest.fn((chatId, newName) => {
    /**/
  });
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(
    <ChatRoom
      chat={mockChat}
      panelWidth={mockPanelWidth}
      onChatDelete={mockOnChatDelete}
      onChatMessage={mockOnChatMessage}
      onChatNameChange={mockOnChatNameChange}
    />,
  );
  expect(baseElement).toBeTruthy();
});

it('should have correct width', () => {
  mockPanelWidth = 300;
  renderWithProviders(
    <ChatRoom
      chat={mockChat}
      panelWidth={mockPanelWidth}
      onChatDelete={mockOnChatDelete}
      onChatMessage={mockOnChatMessage}
      onChatNameChange={mockOnChatNameChange}
    />,
  );
  expect(screen.getByTestId('chat-room')).toHaveStyle('width: calc(100vw - 300px)');
});

it('should handle onChatDelete correctly', () => {
  mockChat = createChat({ id: '1', name: 'test chat 1' });
  renderWithProviders(
    <ChatRoom
      chat={mockChat}
      panelWidth={mockPanelWidth}
      onChatDelete={mockOnChatDelete}
      onChatMessage={mockOnChatMessage}
      onChatNameChange={mockOnChatNameChange}
    />,
  );

  const deleteBtn = screen.getByTestId('delete-btn');
  expect(deleteBtn).toBeTruthy();
  fireEvent.click(deleteBtn as Element);

  waitFor(() => {
    const confirmBtn = screen.queryByTestId('chat-delete-confirm');
    expect(confirmBtn).toBeTruthy();
    fireEvent.click(confirmBtn as Element);
    expect(mockOnChatDelete).toHaveBeenCalledWith(mockChat?.id);
  });
});

it('should handle onChatMessage correctly', () => {
  mockChat = createChat({ id: '1', name: 'test chat 1' });
  renderWithProviders(
    <ChatRoom
      chat={mockChat}
      panelWidth={mockPanelWidth}
      onChatDelete={mockOnChatDelete}
      onChatMessage={mockOnChatMessage}
      onChatNameChange={mockOnChatNameChange}
    />,
  );

  const input = screen.getByTestId('chat-message-box-input');
  expect(input).toBeTruthy();
  fireEvent.input(input as Element, { target: { value: '123' } });
  expect((input as HTMLInputElement).value).toEqual('123');

  const sendBtn = screen.queryByTestId('chat-message-box-send-btn');
  expect(sendBtn).toBeTruthy();
  fireEvent.click(sendBtn as Element);
  expect(mockOnChatMessage).toHaveBeenCalledWith('123');
});

it('should handle onChatNameChange correctly', () => {
  mockChat = createChat({ id: '1', name: 'test chat 1' });
  const { baseElement } = renderWithProviders(
    <ChatRoom
      chat={mockChat}
      panelWidth={mockPanelWidth}
      onChatDelete={mockOnChatDelete}
      onChatMessage={mockOnChatMessage}
      onChatNameChange={mockOnChatNameChange}
    />,
  );

  const editBtn = screen.getByTestId('edit-btn');
  expect(editBtn).toBeTruthy();
  fireEvent.click(editBtn as Element);

  const input = screen.getByTestId('chat-name-edit');
  expect(input).toBeTruthy();
  fireEvent.input(input as Element, { target: { value: '123' } });
  expect((input as HTMLInputElement).value).toEqual('123');

  const saveBtn = screen.queryByTestId('chat-name-edit-submit');
  expect(saveBtn).toBeTruthy();
  fireEvent.click(saveBtn as Element);
  expect(mockOnChatNameChange).toHaveBeenCalledWith(mockChat.id, '123');
});
