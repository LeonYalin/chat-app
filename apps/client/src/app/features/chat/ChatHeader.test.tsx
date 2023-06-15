import { renderWithProviders } from '@client/utils/test-utils';
import { ChatHeader } from './ChatHeader';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createChat } from '@shared/models/chat.model';
import { User, createUser } from '@shared/models/user.model';

let mockChat: ReturnType<typeof createChat> | null = null;
let mockUser: ReturnType<typeof createUser> | null = null;
let mockUser2: ReturnType<typeof createUser> | null = null;
let mockUser3: ReturnType<typeof createUser> | null = null;
let mockAllUsers: ReturnType<typeof createUser>[] = [];
let mockOnChatDelete: jest.Mock;
let mockOnChatNameChange: jest.Mock;
let mockOnParticipantsChange: jest.Mock;
let mockOnSignOut: jest.Mock;
let mockOnUserDelete: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockChat = createChat({ name: 'test chat' });
  mockUser = createUser({ name: 'test user' });
  mockUser2 = createUser({ name: 'Test User 2' });
  mockUser3 = createUser({ name: 'Test User 3' });
  mockAllUsers = [mockUser, mockUser2, mockUser3];
  mockOnChatDelete = jest.fn(chatId => {
    /**/
  });
  mockOnChatNameChange = jest.fn((chatId, newName) => {
    /**/
  });
  mockOnParticipantsChange = jest.fn((participants: User[]) => {
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
      allUsers={mockAllUsers}
      participantsEmpty={false}
      onParticipantsChange={mockOnParticipantsChange}
      onChatDelete={mockOnChatDelete}
      onChatNameChange={mockOnChatNameChange}
      onSignOut={mockOnSignOut}
      onUserDelete={mockOnUserDelete}
    />,
  );
  expect(baseElement).toBeTruthy();
});
