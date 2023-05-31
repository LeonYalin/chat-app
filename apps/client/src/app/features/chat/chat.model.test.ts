import { createChat, createChatMessage } from './chat.model';

it('should create an empty chat correctly', () => {
  const chat = createChat();
  expect(chat).toEqual({
    id: expect.any(String),
    name: 'New Chat',
    avatarUrl: '',
    messages: [],
    participants: [],
    createdAt: expect.any(Number),
  });
});

it('should create chat with data correctly', () => {
  const chat = createChat({
    name: 'My Chat',
    createdAt: 123456,
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
    createdAt: 123456,
  });
});

it('should create an empty chat message correctly', () => {
  const chatMessage = createChatMessage();
  expect(chatMessage).toEqual({
    id: expect.any(String),
    content: '',
    chatUserId: 'Me',
    createdAt: expect.any(Number),
  });
});

it('should create a chat message with data correctly', () => {
  const chatMessage = createChatMessage({
    id: '123',
    content: 'Hello',
    chatUserId: '123',
    createdAt: 123456,
  });
  expect(chatMessage).toEqual({
    id: '123',
    content: 'Hello',
    chatUserId: '123',
    createdAt: 123456,
  });
});
