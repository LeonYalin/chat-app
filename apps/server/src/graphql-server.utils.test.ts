import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { createApolloTestingServer, getResponseData } from './graphql-server.utils';
import { Chat, ChatMessage } from '@shared/models/chat.model';
import { ChatFieldsFragmentStr, ChatMessageFieldsFragmentStr } from '@shared/graphql/fragments';
import { AddChatMessageMutationStr, AddChatMutationStr, ChangeChatNameMutationStr, DeleteChatMutationStr } from '@shared/graphql/mutations';
import { LoadChatQueryStr, LoadAllChatsQueryStr as LoadAllChatsQueryStr } from '@shared/graphql/queries';
import db from './db.utils';

async function testAddChat(testServer: ApolloServer, mockChat: Chat) {
  const response = await testServer.executeOperation<{ chat: Chat }>({
    query: `${ChatFieldsFragmentStr}${AddChatMutationStr}`,
    variables: { chat: mockChat },
  });

  const { data, errors } = getResponseData<{ addChat: Chat }>(response);
  expect(errors).toBeUndefined();
  expect(data.addChat).toEqual(mockChat);
}

async function testLoadChat(testServer: ApolloServer, mockChatId: string, { expected }: { expected: Chat }) {
  const response = await testServer.executeOperation({
    query: `${ChatFieldsFragmentStr}${LoadChatQueryStr}`,
    variables: { chatId: mockChatId },
  });

  const { data, errors } = getResponseData<{ loadChat: Chat }>(response);
  expect(errors).toBeUndefined();
  expect(data.loadChat).toEqual(expected);
}

async function testAddChatMessage(testServer: ApolloServer, chatId: string, content: string) {
  const response = await testServer.executeOperation<{ chatId: string; content: string }>({
    query: `${ChatMessageFieldsFragmentStr}${AddChatMessageMutationStr}`,
    variables: { chatId, content },
  });

  const { data, errors } = getResponseData<{ addChatMessage: { chatId: string; message: ChatMessage } }>(response);
  expect(errors).toBeUndefined();
  expect(data.addChatMessage.chatId).toEqual(chatId);
  expect(data.addChatMessage.message.content).toEqual(content);
}

async function testChangeChatName(testServer: ApolloServer, chatId: string, newName: string) {
  const response = await testServer.executeOperation<{ chatId: string; newName: string }>({
    query: `${ChatFieldsFragmentStr}${ChangeChatNameMutationStr}`,
    variables: { chatId, newName },
  });

  const { data, errors } = getResponseData<{ changeChatName: Chat }>(response);
  expect(errors).toBeUndefined();
  expect(data.changeChatName.id).toEqual(chatId);
  expect(data.changeChatName.name).toEqual(newName);
}

async function testDeleteChat(testServer: ApolloServer, mockChat: Chat) {
  const response = await testServer.executeOperation<{ chatId: string }>({
    query: `${DeleteChatMutationStr}`,
    variables: { chatId: mockChat.id },
  });

  const { data, errors } = getResponseData<{ deleteChat: string }>(response);
  expect(errors).toBeUndefined();
  expect(data.deleteChat).toEqual(mockChat.id);
}

async function testLoadAllChats(testServer: ApolloServer, { expected }: { expected: Chat[] }) {
  const response = await testServer.executeOperation({
    query: `${ChatFieldsFragmentStr}${LoadAllChatsQueryStr}`,
    variables: {},
  });

  const { data, errors } = getResponseData<{ loadAllChats: Chat[] }>(response);
  expect(errors).toBeUndefined();
  expect(data.loadAllChats).toEqual(expected);
}

describe('Chats server tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await db().delete('/chats');
  });

  afterAll(async () => {
    await db().delete('/chats');
  });

  test('should add a chat correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat = {
      id: '123',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });
  });

  test('should delete a chat correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat = {
      id: '234',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };
    await testAddChat(testServer, mockChat);
    await testDeleteChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [] });
  });

  test('should load chats correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat = {
      id: '345',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });

    const mockChat2 = {
      id: '456',
      name: 'My Chat 2',
      avatarUrl: 'https://example.com2',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat2);
    await testLoadAllChats(testServer, { expected: [mockChat, mockChat2] });
  });

  test('should add a chat messsage correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat = {
      id: '567',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });
    await testAddChatMessage(testServer, mockChat.id, 'Hello World');
  });

  test('should change a chat name correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat = {
      id: '678',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });
    await testChangeChatName(testServer, mockChat.id, 'Chat Name Changed');
  });

  test('should load a chat correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat = {
      id: '234',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };
    await testAddChat(testServer, mockChat);
    await testLoadChat(testServer, mockChat.id, { expected: mockChat });
  });
});
