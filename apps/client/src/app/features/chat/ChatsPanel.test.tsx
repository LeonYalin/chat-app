import { renderWithProviders } from '@client/utils/test-utils';
import { ChatsPanel } from './ChatsPanel';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { Chat, createChat } from '@shared/models/chat.model';

const mockChats: Chat[] = [];
let mockPanelWidth = 0;
let mockOnAddChatClick: jest.Mock;
let mockOnChatClick: jest.Mock;
let mockOnLogoClick: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockPanelWidth = 0;
  mockOnAddChatClick = jest.fn(() => {
    /**/
  });
  mockOnChatClick = jest.fn((chatId: string) => {
    /**/
  });
  mockOnLogoClick = jest.fn(() => {
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
      onLogoClick={mockOnLogoClick}
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
      onLogoClick={mockOnLogoClick}
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
      onLogoClick={mockOnLogoClick}
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
      onLogoClick={mockOnLogoClick}
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
      onLogoClick={mockOnLogoClick}
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
      onLogoClick={mockOnLogoClick}
    ></ChatsPanel>,
  );
  waitFor(() => {
    const chatListItem = screen.getByTestId('chats-list-item');
    expect(chatListItem).toBeTruthy();
    expect(chatListItem).toHaveTextContent('test chat 1');
  });
});

it('should click on chat correctly', () => {
  mockChats.push(createChat({ name: 'test chat 1' }), createChat({ name: 'test chat 2' }));
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
      onLogoClick={mockOnLogoClick}
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

it('should click on logo correctly', () => {
  mockChats.push(createChat({ id: '1', name: 'test chat 1' }));
  renderWithProviders(
    <ChatsPanel
      chats={mockChats}
      panelWidth={mockPanelWidth}
      onChatClick={mockOnChatClick}
      onAddChatClick={mockOnAddChatClick}
      onLogoClick={mockOnLogoClick}
    ></ChatsPanel>,
  );

  waitFor(() => {
    const chatItem = screen.getByText('test chat 1');
    expect(chatItem).toBeTruthy();
    fireEvent.click(chatItem as HTMLElement);
    expect(mockOnChatClick).toHaveBeenCalledWith(mockChats[0].id);
    expect(window.location.pathname).toBe('/chats/1');

    const logo = screen.getByTestId('logo-wrapper');
    expect(logo).toBeTruthy();
    fireEvent.click(logo as HTMLElement);
    expect(mockOnLogoClick).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });
});
