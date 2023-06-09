import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { createApolloTestingServer, getResponseData } from './graphql.server.utils';
import { Chat, ChatMessage } from '@shared/models/chat.model';
import { ChatFieldsFragmentStr, ChatMessageFieldsFragmentStr, UserFieldsFragmentStr } from '@shared/graphql/fragments';
import {
  AddChatMessageMutationStr,
  AddChatMutationStr,
  ChangeChatNameMutationStr,
  ChangeChatParticipantsMutationStr,
  DeleteChatMutationStr,
  DeleteUserMutationStr,
  SignUpMutationStr,
} from '@shared/graphql/mutations';
import {
  LoadChatQueryStr,
  LoadAllChatsQueryStr as LoadAllChatsQueryStr,
  SignInQueryStr,
  LoadAllUsersQueryStr,
} from '@shared/graphql/queries';
import db from '../db.utils';
import { User } from '@shared/models/user.model';
import { comparePasswordAndHash, hashPassword } from '../crypto.utils';

async function testAddChat(testServer: ApolloServer, mockChat: Chat) {
  const response = await testServer.executeOperation<{ chat: Chat }>({
    query: `${UserFieldsFragmentStr}${ChatMessageFieldsFragmentStr}${ChatFieldsFragmentStr}${AddChatMutationStr}`,
    variables: { chat: mockChat },
  });

  const { data, errors } = getResponseData<{ addChat: Chat }>(response);
  expect(errors).toBeUndefined();
  expect(data.addChat).toEqual(mockChat);
}

async function testLoadChat(testServer: ApolloServer, mockChatId: string, { expected }: { expected: Chat }) {
  const response = await testServer.executeOperation({
    query: `${UserFieldsFragmentStr}${ChatMessageFieldsFragmentStr}${ChatFieldsFragmentStr}${LoadChatQueryStr}`,
    variables: { chatId: mockChatId },
  });

  const { data, errors } = getResponseData<{ loadChat: Chat }>(response);
  expect(errors).toBeUndefined();
  expect(data.loadChat).toEqual(expected);
}

async function testAddChatMessage(testServer: ApolloServer, chatId: string, content: string, userName: string) {
  const response = await testServer.executeOperation<{ chatId: string; content: string; userName: string }>({
    query: `${ChatMessageFieldsFragmentStr}${AddChatMessageMutationStr}`,
    variables: { chatId, content, userName },
  });

  const { data, errors } = getResponseData<{ addChatMessage: { chatId: string; message: ChatMessage } }>(response);
  expect(errors).toBeUndefined();
  expect(data.addChatMessage.chatId).toEqual(chatId);
  expect(data.addChatMessage.message.content).toEqual(content);
  expect(data.addChatMessage.message.userName).toEqual(userName);
}

async function testChangeChatName(testServer: ApolloServer, chatId: string, newName: string) {
  const response = await testServer.executeOperation<{ chatId: string; newName: string }>({
    query: `${UserFieldsFragmentStr}${ChatMessageFieldsFragmentStr}${ChatFieldsFragmentStr}${ChangeChatNameMutationStr}`,
    variables: { chatId, newName },
  });

  const { data, errors } = getResponseData<{ changeChatName: Chat }>(response);
  expect(errors).toBeUndefined();
  expect(data.changeChatName.id).toEqual(chatId);
  expect(data.changeChatName.name).toEqual(newName);
}

async function testDeleteChat(testServer: ApolloServer, mockChatId: string) {
  const response = await testServer.executeOperation<{ chatId: string }>({
    query: `${DeleteChatMutationStr}`,
    variables: { chatId: mockChatId },
  });

  const { data, errors } = getResponseData<{ deleteChat: string }>(response);
  expect(errors).toBeUndefined();
  expect(data.deleteChat).toEqual(mockChatId);
}

async function testLoadAllChats(testServer: ApolloServer, { expected }: { expected: Chat[] }) {
  const response = await testServer.executeOperation({
    query: `${UserFieldsFragmentStr}${ChatMessageFieldsFragmentStr}${ChatFieldsFragmentStr}${LoadAllChatsQueryStr}`,
    variables: {},
  });

  const { data, errors } = getResponseData<{ loadAllChats: Chat[] }>(response);
  expect(errors).toBeUndefined();
  expect(data.loadAllChats.length).toEqual(expected.length);
  expect(data.loadAllChats).toEqual(expected);
}

async function testSignUp(
  testServer: ApolloServer,
  { name, email, password, attempt }: { name: string; email: string; password: string; attempt: number },
) {
  const response = await testServer.executeOperation({
    query: `${UserFieldsFragmentStr}${SignUpMutationStr}`,
    variables: { name, email, password },
  });

  const { data, errors } = getResponseData<{ signUp: User }>(response);
  if (attempt === 1) {
    expect(errors).toBeUndefined();
    expect(data.signUp.name).toEqual(name);
    expect(data.signUp.email).toEqual(email);

    const validPassword = await comparePasswordAndHash(password, data.signUp.password).catch(err => {
      throw new Error(err);
    });
    expect(validPassword).toBeTruthy();
  } else {
    expect(errors).toBeDefined();
    expect(errors[0].message).toEqual('Email already exists');
  }
}

async function testSignIn(testServer: ApolloServer, { email, password, valid }: { email: string; password: string; valid: boolean }) {
  const response = await testServer.executeOperation({
    query: `${UserFieldsFragmentStr}${SignInQueryStr}`,
    variables: { email, password },
  });

  const { data, errors } = getResponseData<{ signIn: User }>(response);
  if (valid) {
    expect(errors).toBeUndefined();
    expect(data.signIn.email).toEqual(email);

    const validPassword = await comparePasswordAndHash(password, data.signIn.password).catch(err => {
      throw new Error(err);
    });
    expect(validPassword).toBeTruthy();
  } else {
    expect(errors).toBeDefined();
    expect(errors[0].message).toEqual('User not found');
  }
}

async function testDeleteUser(testServer: ApolloServer, mockUserEmail: string) {
  const response = await testServer.executeOperation<{ userEmail: string }>({
    query: `${DeleteUserMutationStr}`,
    variables: { userEmail: mockUserEmail },
  });

  const { data, errors } = getResponseData<{ deleteUser: string }>(response);
  expect(errors).toBeUndefined();
  expect(data.deleteUser).toEqual(mockUserEmail);
}

async function testLoadAllUsers(testServer: ApolloServer, { expected }: { expected: User[] }) {
  const response = await testServer.executeOperation({
    query: `${UserFieldsFragmentStr}${LoadAllUsersQueryStr}`,
    variables: {},
  });

  const { data, errors } = getResponseData<{ loadAllUsers: User[] }>(response);
  expect(errors).toBeUndefined();
  expect(data.loadAllUsers.length).toEqual(expected.length);
  data.loadAllUsers.forEach((user, index) => {
    expect(user.name).toEqual(expected[index].name);
    expect(user.email).toEqual(expected[index].email);
  });
}

async function testChangeChatParticipants(testServer: ApolloServer, chatId: string, participants: User[], newName: string) {
  const response = await testServer.executeOperation<{ chatId: string; participants: User[]; newName: string }>({
    query: `${UserFieldsFragmentStr}${ChatMessageFieldsFragmentStr}${ChatFieldsFragmentStr}${ChangeChatParticipantsMutationStr}`,
    variables: { chatId, participants, newName },
  });

  const { data, errors } = getResponseData<{ changeChatParticipants: Chat }>(response);
  expect(errors).toBeUndefined();
  expect(data.changeChatParticipants.id).toEqual(chatId);
  expect(data.changeChatParticipants.participants).toEqual(participants);
  expect(data.changeChatParticipants.name).toEqual(newName);
}

async function clearDbData() {
  await Promise.all([db().delete('/chats'), db().delete('/users')]);
}

const mockParticipants: User[] = [
  {
    id: '123',
    name: 'John Doe',
    email: 'testemail@gmail.com',
    password: 'testpassword',
    avatarUrl: 'https://example.com',
    createdAt: new Date().toISOString(),
  },
];

describe('Chats server tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await clearDbData();
  });

  afterAll(async () => {
    await clearDbData();
  });

  test('should add a chat correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat: Chat = {
      id: '123',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });
  });

  test('should delete a chat correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat: Chat = {
      id: '234',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };
    await testAddChat(testServer, mockChat);
    await testDeleteChat(testServer, mockChat.id);
    await testLoadAllChats(testServer, { expected: [] });
  });

  test('should load all chats correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat: Chat = {
      id: '345',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });

    const mockChat2: Chat = {
      id: '456',
      name: 'My Chat 2',
      avatarUrl: 'https://example.com2',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat2);
    await testLoadAllChats(testServer, { expected: [mockChat, mockChat2] });
  });

  test('should add a chat messsage correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat: Chat = {
      id: '567',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });
    await testAddChatMessage(testServer, mockChat.id, 'Test User', 'Hello World');
  });

  test('should change a chat name correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat: Chat = {
      id: '678',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });
    await testChangeChatName(testServer, mockChat.id, 'Chat Name Changed');
  });

  test('should load a chat correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllChats(testServer, { expected: [] });

    const mockChat: Chat = {
      id: '234',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };
    await testAddChat(testServer, mockChat);
    await testLoadChat(testServer, mockChat.id, { expected: mockChat });
  });

  test('should sign user up correctly', async () => {
    const testServer = createApolloTestingServer();

    const mockSignUpData: { name: string; email: string; password: string; attempt: number } = {
      name: 'My User',
      email: 'blabla@gmail.com',
      password: '123456',
      attempt: 1,
    };

    await testSignUp(testServer, mockSignUpData);
    await testSignUp(testServer, { ...mockSignUpData, attempt: 2 });
  });

  test('should sign user in correctly', async () => {
    const testServer = createApolloTestingServer();

    const mockSignInValidData: { email: string; password: string; valid: boolean } = {
      email: 'blabla@gmail.com',
      password: '123456',
      valid: true,
    };

    const mockSignInInvalidData: { email: string; password: string; valid: boolean } = {
      email: 'invalid@email.com',
      password: '000000',
      valid: false,
    };
    const mockSignUpData: { name: string; email: string; password: string; attempt: number } = {
      email: 'blabla@gmail.com',
      password: '123456',
      name: 'My User',
      attempt: 1,
    };
    await testSignUp(testServer, mockSignUpData);
    await testSignIn(testServer, mockSignInValidData);
    await testSignIn(testServer, mockSignInInvalidData);
  });

  test('should delete a user correctly', async () => {
    const testServer = createApolloTestingServer();

    const mockUser: User = {
      id: '123',
      name: 'My User',
      email: 'testemail@gmail.com',
      password: 'testpassword',
      avatarUrl: 'https://example.com',
      createdAt: new Date().toISOString(),
    };
    const hashedPassword = await hashPassword(mockUser.password).catch(err => {
      throw new Error(err);
    });
    mockUser.password = hashedPassword;

    await testSignUp(testServer, { ...mockUser, attempt: 1 });
    await testSignIn(testServer, { ...mockUser, valid: true });
    await testDeleteUser(testServer, mockUser.email);
    await testSignIn(testServer, { ...mockUser, valid: false });
  });

  test('should load all users correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllUsers(testServer, { expected: [] });

    const mockUser: User = {
      id: '345',
      name: 'Test User',
      email: 'testemail@gmail.com',
      password: 'testpassword',
      avatarUrl: 'https://example.com',
      createdAt: new Date().toISOString(),
    };

    const mockUser2: User = {
      id: '123',
      name: 'Test User2',
      email: 'testemail2@gmail.com',
      password: 'testpassword2',
      avatarUrl: 'https://example2.com',
      createdAt: new Date().toISOString(),
    };

    await testSignUp(testServer, { ...mockUser, attempt: 1 });
    await testSignUp(testServer, { ...mockUser2, attempt: 1 });
    await testLoadAllUsers(testServer, { expected: [mockUser, mockUser2] });
  });

  test('should change a chat participants and a chat name correctly', async () => {
    const testServer = createApolloTestingServer();
    await testLoadAllUsers(testServer, { expected: [] });

    const mockUser: User = {
      id: '345',
      name: 'Test User',
      email: 'testemail@gmail.com',
      password: 'testpassword',
      avatarUrl: 'https://example.com',
      createdAt: new Date().toISOString(),
    };

    const mockUser2: User = {
      id: '123',
      name: 'Test User2',
      email: 'testemail2@gmail.com',
      password: 'testpassword2',
      avatarUrl: 'https://example2.com',
      createdAt: new Date().toISOString(),
    };

    await testSignUp(testServer, { ...mockUser, attempt: 1 });
    await testSignUp(testServer, { ...mockUser2, attempt: 1 });
    await testLoadAllUsers(testServer, { expected: [mockUser, mockUser2] });

    const mockChat: Chat = {
      id: '678',
      name: 'My Chat',
      avatarUrl: 'https://example.com',
      messages: [],
      participants: mockParticipants,
      createdAt: new Date().toISOString(),
    };

    await testAddChat(testServer, mockChat);
    await testLoadAllChats(testServer, { expected: [mockChat] });

    const newMockParticipants: User[] = [...mockParticipants, mockUser, mockUser2];
    await testChangeChatParticipants(testServer, mockChat.id, newMockParticipants, 'Chat Name Changed');
  });
});
