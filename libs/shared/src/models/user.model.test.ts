import { createUser } from './user.model';

const now = new Date().toISOString();

it('should create an empty user correctly', () => {
  const user = createUser();
  expect(user).toEqual({
    id: expect.any(String),
    name: '',
    avatarUrl: '',
    email: '',
    password: '',
    createdAt: expect.any(String),
  });
});

it('should create a user with data correctly', () => {
  const user = createUser({
    id: '123',
    name: 'My User',
    avatarUrl: 'https://example.com',
    email: 'testemail@gmail.com',
    password: 'testpassword',
    createdAt: now,
  });
  expect(user).toEqual({
    id: '123',
    name: 'My User',
    avatarUrl: 'https://example.com',
    email: 'testemail@gmail.com',
    password: 'testpassword',
    createdAt: now,
  });
});
