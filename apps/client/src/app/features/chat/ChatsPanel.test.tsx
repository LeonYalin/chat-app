import { renderWithProviders } from '@client/utils/test-utils';
import { ChatsPanel } from './ChatsPanel';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { Chat, createChat } from '@shared/models/chat.model';

const mockChats: Chat[] = [];
let mockPanelWidth = 0;
let mockOnAddChatClick: jest.Mock;
let mockOnChatClick: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockPanelWidth = 0;
  mockOnAddChatClick = jest.fn(() => {
    /**/
  });
  mockOnChatClick = jest.fn((chatId: string) => {
    /**/
  });
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
    ></ChatsPanel>,
  );
  expect(baseElement).toBeTruthy();
});

it('should set widht of the panel correctly', () => {
  mockPanelWidth = 300;
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
    ></ChatsPanel>,
  );
  expect(screen.getByTestId('chats-panel')).toHaveStyle('width: 300px');
});

it('should render the empty state icon and message if no chats provided', () => {
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
    ></ChatsPanel>,
  );
  expect(screen.getByTestId('ChatIcon')).toBeTruthy();
  expect(screen.getByText('There are no active chats.')).toBeTruthy();
  expect(screen.getByText('Create a new chat to start messaging.')).toBeTruthy();
});

it('should handle add chat correctly from header', () => {
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
    ></ChatsPanel>,
  );
  const addChatHeaderBtn = screen.getByTestId('add-chat-btn-header');
  expect(addChatHeaderBtn).toBeTruthy();
  fireEvent.click(addChatHeaderBtn);
  expect(mockOnAddChatClick).toHaveBeenCalled();
});

it('should handle add chat correctly from body', () => {
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
    ></ChatsPanel>,
  );
  const addChatBodyBtn = screen.getByTestId('add-chat-btn-body');
  expect(addChatBodyBtn).toBeTruthy();
  fireEvent.click(addChatBodyBtn);
  expect(mockOnAddChatClick).toHaveBeenCalled();
});

it('should render chats list correctly', () => {
  mockChats.push(createChat({ id: '1', name: 'test chat 1' }));
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
    ></ChatsPanel>,
  );
  waitFor(() => {
    const chatListItem = screen.getByTestId('chats-list-item');
    expect(chatListItem).toBeTruthy();
    expect(chatListItem).toHaveTextContent('test chat 1');
  });
});

it('should chat click correctly', () => {
  mockChats.push(createChat({ name: 'test chat 1' }), createChat({ name: 'test chat 2' }));
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
    ></ChatsPanel>,
  );

  waitFor(() => {
    const chatListItems = screen.getAllByTestId('chats-list-item');
    expect(chatListItems).toHaveLength(2);
    expect(chatListItems.at(0)).toHaveTextContent('test chat 1');
    expect(chatListItems.at(1)).toHaveTextContent('test chat 2');

    fireEvent.click(chatListItems.at(0) as HTMLElement);
    expect(mockOnChatClick).toHaveBeenCalledWith(mockChats[0].id);
  });
});
