import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '@client/utils/test-utils';
import { AppDialogsProvider } from '@client/hooks/useDialog';
import { User, createUser } from '@shared/models/user.model';
import { ChatHeaderParticipants } from './ChatHeaderParticipants';

let mockCurrentUser: ReturnType<typeof createUser> | null = null;
let mockUser2: ReturnType<typeof createUser> | null = null;
let mockUser3: ReturnType<typeof createUser> | null = null;
let participants: User[] = [];
let availableParticipants: User[] = [];
let onParticipantsChange: jest.Mock;
let baseElement: HTMLElement;

beforeEach(() => {
  jest.clearAllMocks();
  mockCurrentUser = createUser({ name: 'Test User 1' });
  mockUser2 = createUser({ name: 'Test User 2' });
  mockUser3 = createUser({ name: 'Test User 3' });
  participants = [mockCurrentUser];
  availableParticipants = [mockCurrentUser, mockUser2, mockUser3];
  onParticipantsChange = jest.fn((participants: User[]) => {
    /**/
  });
  baseElement = renderWithProviders(
    <AppDialogsProvider>
      <ChatHeaderParticipants
        user={mockCurrentUser}
        participants={participants}
        availableParticipants={availableParticipants}
        onParticipantsChange={onParticipantsChange}
      />
    </AppDialogsProvider>,
  ).baseElement;
});

it('should render successfully', () => {
  expect(baseElement).toBeTruthy();
});

it('should show correct participants and select them', async () => {
  const autocomplete = await screen.findByTestId('autocomplete-widget');
  expect(autocomplete).toBeTruthy();
  const autocompeleInput = await within(autocomplete).findByRole('combobox');
  expect(autocompeleInput).toBeTruthy();

  fireEvent.click(autocomplete as Element);
  fireEvent.focus(autocomplete as Element);
  fireEvent.change(autocompeleInput, { target: { value: 'Test User' } });

  const options = await screen.findAllByRole('option');
  expect(options).toHaveLength(2);
  expect(options[0]).toHaveTextContent('Test User 2');
  expect(options[1]).toHaveTextContent('Test User 3');
  expect(options[0]).not.toHaveTextContent('Test User 1'); // current user should not be in the list

  fireEvent.click(options[0] as Element);
  fireEvent.blur(autocomplete as Element);
  await waitFor(() => {
    expect(onParticipantsChange).toHaveBeenCalledWith([mockUser2, mockCurrentUser]);
  });
});
