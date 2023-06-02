import { renderWithProviders } from '@client/utils/test-utils';
import { ChatsPanel } from './ChatsPanel';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { Chat, createChat } from '@shared/models/chat.model';

const mockChats: Chat[] = [];
let mockPanelWidth = 0;
let mockOnAddChatClick: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockPanelWidth = 0;
  mockOnAddChatClick = jest.fn(() => {
    /**/
  });
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(
    <ChatsPanel chats={mockChats} panelWidth={mockPanelWidth} onAddChatClick={mockOnAddChatClick}></ChatsPanel>,
  );
  expect(baseElement).toBeTruthy();
});

it('should set widht of the panel correctly', () => {
  mockPanelWidth = 300;
  renderWithProviders(<ChatsPanel chats={mockChats} panelWidth={mockPanelWidth} onAddChatClick={mockOnAddChatClick}></ChatsPanel>);
  expect(screen.getByTestId('chats-panel')).toHaveStyle('width: 300px');
});

it('should render the empty state icon and message if no chats provided', () => {
  renderWithProviders(<ChatsPanel chats={mockChats} panelWidth={mockPanelWidth} onAddChatClick={mockOnAddChatClick}></ChatsPanel>);
  expect(screen.getByTestId('ChatIcon')).toBeTruthy();
  expect(screen.getByText('There are no active chats.')).toBeTruthy();
  expect(screen.getByText('Create a new chat to start messaging.')).toBeTruthy();
});

it('should handle add chat correctly', () => {
  renderWithProviders(<ChatsPanel chats={mockChats} panelWidth={mockPanelWidth} onAddChatClick={mockOnAddChatClick}></ChatsPanel>);
  const addChatBtn = screen.getByTestId('add-chat');
  expect(addChatBtn).toBeTruthy();
  fireEvent.click(addChatBtn);
  expect(mockOnAddChatClick).toHaveBeenCalled();
});

it('should render chats list correctly', () => {
  mockChats.push(createChat({ id: '1', name: 'test chat 1' }));
  renderWithProviders(<ChatsPanel chats={mockChats} panelWidth={mockPanelWidth} onAddChatClick={mockOnAddChatClick}></ChatsPanel>);
  waitFor(() => {
    const chatListItem = screen.getByTestId('chats-list-item-');
    expect(chatListItem).toBeTruthy();
    expect(chatListItem).toHaveTextContent('test chat 1');
  });
});
