import { screen, fireEvent, waitFor } from '@testing-library/react';
import { AppStore, setupStore } from '@client/store';
import { renderWithProviders } from '@client/utils/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { SignIn } from './SignIn';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import { User } from '@shared/models/chat.model';

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'testemail@gmail.com',
  password: 'testpassword',
  avatarUrl: 'testurl',
  createdAt: new Date().toISOString(),
};

export const handlers = [
  graphql.query('SignIn', (req, res, ctx) => {
    return res(
      ctx.data({
        signIn: mockUser,
      }),
    );
  }),
];

// mock service worker
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

let setItem: jest.SpyInstance;
let store = {} as AppStore;

beforeEach(() => {
  store = setupStore();
});

it('should render correctly', () => {
  const { baseElement } = renderWithProviders(
    <MemoryRouter initialEntries={['/signin']} initialIndex={0}>
      <SignIn />
    </MemoryRouter>,
    { store },
  );
  expect(baseElement).toBeTruthy();
});

it('should render the form correctly', () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/signin']} initialIndex={0}>
      <SignIn />
    </MemoryRouter>,
    { store },
  );
  expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByTestId('signin-submit-btn')).toBeInTheDocument();
  expect(screen.getByTestId('signin-signup-link')).toBeInTheDocument();
});

it('should trigger form validation correctly', async () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/signin']} initialIndex={0}>
      <SignIn />
    </MemoryRouter>,
    { store },
  );
  fireEvent.click(await screen.findByTestId('signin-submit-btn'));
  expect(await screen.findByText('Email is required')).toBeInTheDocument();
  expect(await screen.findByText('Password is required')).toBeInTheDocument();
});

it('should redirect to sign up correctly', async () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/signin']} initialIndex={0}>
      <SignIn />
    </MemoryRouter>,
    { store },
  );
  const signupLink = screen.getByTestId('signin-signup-link');
  expect(signupLink).toBeTruthy();
  fireEvent.click(signupLink);
  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/signup');
  });
});

it('should submit form correctly', async () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/signin']} initialIndex={0}>
      <SignIn />
    </MemoryRouter>,
    { store },
  );
  const emailInput = await screen.findByTestId('signin-input-email');
  expect(emailInput).toBeTruthy();
  fireEvent.input(emailInput as Element, { target: { value: 'testemail@gmail.com' } });
  expect((emailInput as HTMLInputElement).value).toEqual('testemail@gmail.com');

  const passwordInput = await screen.findByTestId('signin-input-password');
  expect(passwordInput).toBeTruthy();
  fireEvent.input(passwordInput as Element, { target: { value: 'testpassword' } });
  expect((passwordInput as HTMLInputElement).value).toEqual('testpassword');

  const submitBtn = await screen.findByTestId('signin-submit-btn');
  expect(submitBtn).toBeTruthy();
  fireEvent.click(submitBtn as Element);
  await waitFor(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });
});

it('should remember the user correctly', async () => {
  renderWithProviders(
    <MemoryRouter initialEntries={['/signin']} initialIndex={0}>
      <SignIn />
    </MemoryRouter>,
    { store },
  );
  const emailInput = await screen.findByTestId('signin-input-email');
  expect(emailInput).toBeTruthy();
  fireEvent.input(emailInput as Element, { target: { value: 'testemail@gmail.com' } });
  expect((emailInput as HTMLInputElement).value).toEqual('testemail@gmail.com');

  const passwordInput = await screen.findByTestId('signin-input-password');
  expect(passwordInput).toBeTruthy();
  fireEvent.input(passwordInput as Element, { target: { value: 'testpassword' } });
  expect((passwordInput as HTMLInputElement).value).toEqual('testpassword');

  const rememberMeCheckbox = await screen.findByTestId('signin-input-rememberme');
  expect(rememberMeCheckbox).toBeTruthy();
  fireEvent.click(rememberMeCheckbox as Element);
  expect((rememberMeCheckbox as HTMLInputElement).checked).toEqual(true);

  const submitBtn = await screen.findByTestId('signin-submit-btn');
  expect(submitBtn).toBeTruthy();

  setItem = jest.spyOn(Storage.prototype, 'setItem');
  fireEvent.click(submitBtn as Element);
  await waitFor(() => {
    expect(setItem).toHaveBeenCalledTimes(1);
  });
});
