import { renderWithProviders } from '@client/utils/test-utils';
import { ChatDetailsMain } from './ChatDetailsMain';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { Chat, createChat } from '@shared/models/chat.model';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import { AppStore, setupStore } from '@client/store';

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
  graphql.query('LoadChats', (req, res, ctx) => {
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
        chats: mockChats,
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

// let mockChat: Chat | null = null;
// let mockPanelWidth = 0;
// let mockOnChatMessage: jest.Mock;
// let mockOnChatDelete: jest.Mock;
// let mockOnChatNameChange: jest.Mock;

// beforeEach(() => {
//   jest.clearAllMocks();
//   mockPanelWidth = 0;
//   mockOnChatMessage = jest.fn(msg => {
//     /**/
//   });
//   mockOnChatDelete = jest.fn(chatId => {
//     /**/
//   });
//   mockOnChatNameChange = jest.fn((chatId, newName) => {
//     /**/
//   });
// });

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(<ChatDetailsMain />);
  expect(baseElement).toBeTruthy();
});

it('should render empty state when no chats selected', () => {
  const { baseElement } = renderWithProviders(<ChatDetailsMain />);
  expect(baseElement).toBeTruthy();

  expect(screen.getByText('Select a chat to start messaging')).toBeTruthy();
});

it('should handle onChatDelete correctly', () => {
  renderWithProviders(<ChatDetailsMain />);

  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(2);
    screen.getByTestId('test').click();

    const deleteBtn = screen.getByTestId('delete-btn');
    expect(deleteBtn).toBeTruthy();
    fireEvent.click(deleteBtn as Element);

    const confirmBtn = screen.queryByTestId('chat-delete-confirm');
    expect(confirmBtn).toBeTruthy();
    fireEvent.click(confirmBtn as Element);

    expect(store.getState().chat.chats.length).toBe(1);
    expect(store.getState().chat.chats[0].id).not.toBe('1');
  });
});

it('should handle onChatMessage correctly', () => {
  renderWithProviders(<ChatDetailsMain />);

  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(2);
    screen.getByTestId('test').click();

    const input = screen.getByTestId('chat-message-box-input');
    expect(input).toBeTruthy();
    fireEvent.input(input as Element, { target: { value: '123' } });
    expect((input as HTMLInputElement).value).toEqual('123');

    const sendBtn = screen.queryByTestId('chat-message-box-send-btn');
    expect(sendBtn).toBeTruthy();
    fireEvent.click(sendBtn as Element);
    const chat = store.getState().chat.chats.find(chat => chat.id === '1');
    expect(chat?.messages[0].content).toEqual('123');
  });
});

it('should handle onChatNameChange correctly', () => {
  renderWithProviders(<ChatDetailsMain />);

  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(2);
    screen.getByTestId('test').click();

    const editBtn = screen.getByTestId('edit-chat-name-btn');
    expect(editBtn).toBeTruthy();
    fireEvent.click(editBtn as Element);

    const input = screen.getByTestId('input-chat-name-edit');
    expect(input).toBeTruthy();
    fireEvent.input(input as Element, { target: { value: '123' } });
    expect((input as HTMLInputElement).value).toEqual('123');

    const saveBtn = screen.queryByTestId('chat-name-edit-submit');
    expect(saveBtn).toBeTruthy();
    fireEvent.click(saveBtn as Element);
    const chat = store.getState().chat.chats.find(chat => chat.id === '1');
    expect(chat?.name).toEqual('123');
  });
});
