import { screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { AppStore, setupStore } from '@client/store';
import { renderWithProviders } from '@client/utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { SignUp } from './SignUp1';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

let store = {} as AppStore;

beforeEach(() => {
  store = setupStore();
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(
    <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
      <SignUp />
    </MemoryRouter>,
    { store },
  );
  expect(baseElement).toBeTruthy();
});

it('should render the form correctly', () => {
  // const history = createMemoryHistory();
  // const location = createLocation('/signup'); // Set the initial URL to '/signup'

  renderWithProviders(
    <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
      <SignUp />
    </MemoryRouter>,
    { store },
  );
  expect(screen.getByLabelText('First Name')).toBeInTheDocument();
  expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByTestId('signup-submit-btn')).toBeInTheDocument();
  expect(screen.getByTestId('signup-signin-link')).toBeInTheDocument();
});

it('should trigger form validation correctly', async () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
      <SignUp />
    </MemoryRouter>,
    { store },
  );
  fireEvent.click(await screen.findByTestId('signup-submit-btn'));
  // waitFor(() => {
  expect(await screen.findByText('First name is required')).toBeInTheDocument();
  expect(await screen.findByText('Last name is required')).toBeInTheDocument();
  expect(await screen.findByText('Email is required')).toBeInTheDocument();
  expect(await screen.findByText('Password is required')).toBeInTheDocument();
  // });
});

it('should submit form correctly', async () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
      <SignUp />
    </MemoryRouter>,
    { store },
  );
  // waitFor(() => {
  const firstNameInput = await screen.findByTestId('signup-input-firstname');
  expect(firstNameInput).toBeTruthy();
  fireEvent.input(firstNameInput as Element, { target: { value: 'First name' } });
  expect((firstNameInput as HTMLInputElement).value).toEqual('First name');

  const lastNameInput = await screen.findByTestId('signup-input-lastname');
  expect(lastNameInput).toBeTruthy();
  fireEvent.input(lastNameInput as Element, { target: { value: 'Last name' } });
  expect((lastNameInput as HTMLInputElement).value).toEqual('Last name');

  const emailInput = await screen.findByTestId('signup-input-email');
  expect(emailInput).toBeTruthy();
  fireEvent.input(emailInput as Element, { target: { value: 'testemail@gmail.com' } });
  expect((emailInput as HTMLInputElement).value).toEqual('testemail@gmail.com');

  const passwordInput = await screen.findByTestId('signup-input-password');
  expect(passwordInput).toBeTruthy();
  fireEvent.input(passwordInput as Element, { target: { value: 'testpassword' } });
  expect((passwordInput as HTMLInputElement).value).toEqual('testpassword');

  const submitBtn = await screen.findByTestId('signup-submit-btn');
  expect(submitBtn).toBeTruthy();
  fireEvent.click(submitBtn as Element);
  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });
});
