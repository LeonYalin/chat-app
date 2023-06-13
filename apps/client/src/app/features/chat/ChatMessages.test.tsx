import { renderWithProviders } from '@client/utils/test-utils';
import { ChatMessages } from './ChatMessages';
import { screen } from '@testing-library/dom';
import { ChatMessage, createChatMessage } from '@shared/models/chat.model';

const mockChatMessages: ChatMessage[] = [];

beforeEach(() => {
  jest.clearAllMocks();
  mockChatMessages.length = 0;
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(<ChatMessages messages={mockChatMessages}></ChatMessages>);
  expect(baseElement).toBeTruthy();
});

it('should render correctly when no messages provided', () => {
  renderWithProviders(<ChatMessages messages={mockChatMessages}></ChatMessages>);
  expect(screen.queryAllByTestId('chat-message')).toHaveLength(0);
});

it('should render correctly when many messages provided', () => {
  mockChatMessages.push(createChatMessage({ id: '1', content: 'test message 1' }));
  mockChatMessages.push(createChatMessage({ id: '2', content: 'test message 2' }));
  renderWithProviders(<ChatMessages messages={mockChatMessages}></ChatMessages>);
  expect(screen.queryAllByTestId('chat-message')).toHaveLength(2);
});

it('should render message contents correctly', () => {
  mockChatMessages.push(createChatMessage({ id: '1', content: 'test message 1', userName: 'test sender 1' }));
  renderWithProviders(<ChatMessages messages={mockChatMessages}></ChatMessages>);
  expect(screen.getByText('test message 1')).toBeTruthy();
  expect(screen.getByText('test sender 1')).toBeTruthy();
});
