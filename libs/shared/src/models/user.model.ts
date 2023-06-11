import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
  createdAt: string;
}

export function createUser(params: Partial<User> = {}) {
  return {
    id: params.id ?? uuidv4(),
    name: params.name ?? '',
    avatarUrl: params.avatarUrl ?? '',
    email: params.email ?? '',
    password: params.password ?? '',
    createdAt: params.createdAt ?? new Date().toISOString(),
  } as User;
}
