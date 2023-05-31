import { renderWithProviders } from '@client/utils/test-utils';
import { ChatHeader } from './ChatHeader';
import { createChat } from './chat.model';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { ChatBody } from './ChatBody';

let mockChat: ReturnType<typeof createChat> | null = null;
let mockOnChatMessage: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockChat = createChat({ name: 'test chat' });
  mockOnChatMessage = jest.fn(msg => {
    /**/
  });
});

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(<ChatBody chat={null} onChatMessage={mockOnChatMessage}></ChatBody>);
  expect(baseElement).toBeTruthy();
});

it('should render successfully, with correct icon and message when no chat provided', () => {
  const { baseElement } = renderWithProviders(<ChatBody chat={null} onChatMessage={mockOnChatMessage}></ChatBody>);
  expect(baseElement).toBeTruthy();

  expect(screen.queryByTestId('QuestionAnswerIcon')).toBeTruthy();
  expect(screen.queryByText('Select a chat to start messaging')).toBeTruthy();
});

it('should render successfully, with correct icon and message when chat is provided, but no messages', () => {
  const { baseElement } = renderWithProviders(<ChatBody chat={mockChat} onChatMessage={mockOnChatMessage}></ChatBody>);
  expect(baseElement).toBeTruthy();

  expect(screen.queryByTestId('ChatBubbleOutlineIcon')).toBeTruthy();
  expect(screen.queryByText("You're starting a new conversation.")).toBeTruthy();
  expect(screen.queryByText('Type your first message below.')).toBeTruthy();
});

it('should render chat message correctly, and pass onChatMessage callback', () => {
  const { baseElement } = renderWithProviders(<ChatBody chat={mockChat} onChatMessage={mockOnChatMessage}></ChatBody>);
  expect(baseElement).toBeTruthy();

  const input = screen.getByTestId('chat-message-box-input');
  expect(input).toBeTruthy();
  fireEvent.input(input as Element, { target: { value: '123' } });
  expect((input as HTMLInputElement).value).toEqual('123');

  const sendBtn = screen.queryByTestId('chat-message-box-send-btn');
  expect(sendBtn).toBeTruthy();
  fireEvent.click(sendBtn as Element);
  expect(mockOnChatMessage).toHaveBeenCalledWith('123');
  waitFor(() => {
    const messageEl = screen.findByTestId('chat-message');
    expect(messageEl).toBeTruthy();
    expect(messageEl).toHaveTextContent('123');
  });
});
