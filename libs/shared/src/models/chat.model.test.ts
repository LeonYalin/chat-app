import { createChat, createChatMessage } from './chat.model';

const now = new Date().toISOString();

it('should create an empty chat correctly', () => {
  const chat = createChat();
  expect(chat).toEqual({
    id: expect.any(String),
    name: 'New Chat',
    avatarUrl: '',
    messages: [],
    participants: [],
    createdAt: expect.any(String),
  });
});

it('should create chat with data correctly', () => {
  const chat = createChat({
    name: 'My Chat',
    createdAt: now,
    id: '123',
    avatarUrl: 'https://example.com',
    messages: [],
    participants: [],
  });
  expect(chat).toEqual({
    id: '123',
    name: 'My Chat',
    avatarUrl: 'https://example.com',
    messages: [],
    participants: [],
    createdAt: now,
  });
});

it('should create an empty chat message correctly', () => {
  const chatMessage = createChatMessage();
  expect(chatMessage).toEqual({
    id: expect.any(String),
    content: '',
    chatUserId: 'Me',
    createdAt: expect.any(String),
  });
});

it('should create a chat message with data correctly', () => {
  const chatMessage = createChatMessage({
    id: '123',
    content: 'Hello',
    chatUserId: '123',
    createdAt: now,
  });
  expect(chatMessage).toEqual({
    id: '123',
    content: 'Hello',
    chatUserId: '123',
    createdAt: now,
  });
});
