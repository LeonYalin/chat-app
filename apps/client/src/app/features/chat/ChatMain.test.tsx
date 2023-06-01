import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatMain } from './ChatMain';
import { setupServer } from 'msw/node';
import { AppStore, setupStore } from '@client/store';
import { renderWithProviders } from '@client/utils/test-utils';
import { graphql } from 'msw';

export const handlers = [
  graphql.query('GetLocations', (req, res, ctx) => {
    return res(
      ctx.data({
        locations: {
          id: '1',
          name: 'test',
          description: 'test',
          photo: 'test',
        },
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
  const { baseElement } = renderWithProviders(<ChatMain />);
  expect(baseElement).toBeTruthy();
});

it('should add a chat to the store correctly', () => {
  renderWithProviders(<ChatMain />, { store });
  const addChatButton = screen.getByText('Add Chat');
  fireEvent.click(addChatButton);
  waitFor(() => {
    expect(store.getState().chat.chats.length).toBe(1);
  });
});

it('should add a chat message to the store correctly', () => {
  renderWithProviders(<ChatMain />, { store });

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

it('should delete a chat from the store correctly', () => {
  renderWithProviders(<ChatMain />, { store });

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
  });
});
