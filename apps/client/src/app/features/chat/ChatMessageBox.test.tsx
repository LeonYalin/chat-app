import { renderWithProviders } from '@client/utils/test-utils';
import { ChatMessageBox } from './ChatMessageBox';
import { fireEvent, screen } from '@testing-library/dom';

let mockOnChatMessage: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockOnChatMessage = jest.fn(msg => {
    /**/
  });
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(<ChatMessageBox onChatMessage={mockOnChatMessage} />);
  expect(baseElement).toBeTruthy();
});

it('should render a chat message correctly, and pass onChatMessage callback', () => {
  const { baseElement } = renderWithProviders(<ChatMessageBox onChatMessage={mockOnChatMessage} />);
  expect(baseElement).toBeTruthy();

  const input = screen.getByTestId('chat-message-box-input');
  expect(input).toBeTruthy();
  fireEvent.input(input as Element, { target: { value: '123' } });
  expect((input as HTMLInputElement).value).toEqual('123');

  const sendBtn = screen.queryByTestId('chat-message-box-send-btn');
  expect(sendBtn).toBeTruthy();
  fireEvent.click(sendBtn as Element);
  expect(mockOnChatMessage).toHaveBeenCalledWith('123');
});
