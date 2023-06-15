import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatMain } from './ChatMain';
import { setupServer } from 'msw/node';
import { AppStore, setupStore } from '@client/store';
import { renderWithProviders } from '@client/utils/test-utils';
import { graphql } from 'msw';
import { Chat } from '@shared/models/chat.model';
import { MemoryRouter } from 'react-router-dom';
import { createUser } from '@shared/models/user.model';

export const handlers = [
  graphql.mutation('AddChat', (req, res, ctx) => {
    const mockChat: Chat = {
      id: '1',
      name: 'test',
      avatarUrl: 'test',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };
    return res(
      ctx.data({
        addChat: mockChat,
      }),
    );
  }),
  graphql.mutation('DeteleChat', (req, res, ctx) => {
    const mockChatId = '1';
    return res(
      ctx.data({
        deleteChat: mockChatId,
      }),
    );
  }),

  graphql.mutation('ChangeChatName', (req, res, ctx) => {
    const mockChat: Chat = {
      id: '1',
      name: 'test2',
      avatarUrl: 'test',
      messages: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };
    return res(
      ctx.data({
        changeChatName: mockChat,
      }),
    );
  }),
  graphql.query('LoadAllChats', (req, res, ctx) => {
    const mockChats: Chat[] = [
      {
        id: '1',
        name: 'test',
        avatarUrl: 'test',
        messages: [],
        participants: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'test2',
        avatarUrl: 'test2',
        messages: [],
        participants: [],
        createdAt: new Date().toISOString(),
      },
    ];
    return res(
      ctx.data({
        loadAllChats: mockChats,
      }),
    );
  }),
  graphql.query('LoadAllUsers', (req, res, ctx) => {
    const mockCurrentUser = createUser({ name: 'Test User 1' });
    const mockUser2 = createUser({ name: 'Test User 2' });
    const mockUser3 = createUser({ name: 'Test User 3' });
    const mockAllUsers = [mockCurrentUser, mockUser2, mockUser3];
    return res(
      ctx.data({
        loadAllUsers: mockAllUsers,
      }),
    );
  }),
];

// mock service worker
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

let store = {} as AppStore;

beforeEach(() => {
  jest.clearAllMocks();
  store = setupStore();
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );
  expect(baseElement).toBeTruthy();
});

it('should have correct width', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );
  expect(screen.getByTestId('chat-room')).toHaveStyle('width: calc(100vw - 240px)');
});

it('should get chats from server correctly', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );
  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(2);
  });
});

it('should add a chat to the store correctly', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );
  const addChatButton = screen.getByText('Add Chat');
  fireEvent.click(addChatButton);
  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(1);
  });
});

it('should add a chat message to the store correctly', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );

  const addChatButton = screen.getByText('Add Chat');
  fireEvent.click(addChatButton);
  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(1);
    expect(store.getState().chat.chats[0].messages.length).toBe(0);

    const input = screen.getByTestId('chat-message-box-input');
    expect(input).toBeTruthy();
    fireEvent.input(input as Element, { target: { value: '123' } });
    expect((input as HTMLInputElement).value).toEqual('123');

    const sendBtn = screen.queryByTestId('chat-message-box-send-btn');
    expect(sendBtn).toBeTruthy();
    fireEvent.click(sendBtn as Element);

    expect(store.getState().chat.chats.length).toBe(1);
    expect(store.getState().chat.chats[0].messages.length).toBe(1);
    expect(store.getState().chat.chats[0].messages[0].content).toBe('123');
  });
});

it('should change a chat name in the store correctly', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );

  const addChatButton = screen.getByText('Add Chat');
  fireEvent.click(addChatButton);

  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(1);

    const changeNameBtn = screen.getByTestId('edit-chat-name-btn');
    expect(changeNameBtn).toBeTruthy();
    fireEvent.click(changeNameBtn as Element);

    const input = screen.getByTestId('input-chat-name-edit');
    expect(input).toBeTruthy();
    fireEvent.input(input as Element, { target: { value: '123' } });
    expect((input as HTMLInputElement).value).toEqual('123');

    const confirmBtn = screen.queryByTestId('chat-name-confirm');
    expect(confirmBtn).toBeTruthy();
    fireEvent.click(confirmBtn as Element);

    expect(store.getState().chat.chats.length).toBe(1);
    expect(store.getState().chat.chats[0].name).toBe('123');
  });
});

it('should delete a chat from the store correctly', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );

  const addChatButton = screen.getByText('Add Chat');
  fireEvent.click(addChatButton);

  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(1);

    const deleteBtn = screen.getByTestId('delete-btn');
    expect(deleteBtn).toBeTruthy();
    fireEvent.click(deleteBtn as Element);

    const confirmBtn = screen.queryByTestId('chat-delete-confirm');
    expect(confirmBtn).toBeTruthy();
    fireEvent.click(confirmBtn as Element);
    expect(store.getState().chat.chats.length).toBe(0);
    expect(store.getState().chat.selectedChatId).toBeNull();
  });
});

it('should load a selected chat from the store correctly', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <ChatMain />
    </MemoryRouter>,
    { store },
  );

  const addChatHeaderBtn = screen.getByTestId('add-chat-btn-header');
  fireEvent.click(addChatHeaderBtn);
  fireEvent.click(addChatHeaderBtn);

  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(2);
    expect(store.getState().chat.selectedChatId).toEqual(store.getState().chat.chats[0].id);

    const chatListItems = screen.getAllByTestId('chats-list-item');
    expect(chatListItems).toHaveLength(2);
    fireEvent.click(chatListItems.at(1) as Element);
    expect(store.getState().chat.selectedChatId).toEqual(store.getState().chat.chats[1].id);
  });
});
