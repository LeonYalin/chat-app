import { renderWithProviders } from '@client/utils/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { ChatBody } from './ChatBody';
import { createChat } from '@shared/models/chat.model';
import { createUser } from '@shared/models/user.model';

let mockChat: ReturnType<typeof createChat> | null = null;
let mockUser: ReturnType<typeof createUser> | null = null;

beforeEach(() => {
  jest.clearAllMocks();
  mockChat = createChat({ name: 'test chat' });
  mockUser = createUser({ name: 'test user' });
});

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(<ChatBody chat={null} user={mockUser}></ChatBody>);
  expect(baseElement).toBeTruthy();
});

it('should render successfully, with correct icon and message when no chat provided', () => {
  const { baseElement } = renderWithProviders(<ChatBody chat={null} user={mockUser}></ChatBody>);
  expect(baseElement).toBeTruthy();
  expect(screen.queryByTestId('QuestionAnswerIcon')).toBeTruthy();
  expect(screen.queryByText('Select a chat to start messaging')).toBeTruthy();
});

it('should render successfully, with correct icon and message when chat is provided, but no messages', () => {
  const { baseElement } = renderWithProviders(<ChatBody chat={mockChat} user={mockUser}></ChatBody>);
  expect(baseElement).toBeTruthy();
  expect(screen.queryByTestId('ChatBubbleOutlineIcon')).toBeTruthy();
  expect(screen.queryByText("You're starting a new conversation.")).toBeTruthy();
  expect(screen.queryByText('Type your first message below.')).toBeTruthy();
});
