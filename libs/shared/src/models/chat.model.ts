import { v4 as uuidv4 } from 'uuid';

export interface Chat {
  id: string;
  name: string;
  avatarUrl: string;
  messages: ChatMessage[];
  participants: User[];
  createdAt: string;
}

export function createChat(params: Partial<Chat> = {}) {
  return {
    id: params.id ?? uuidv4(),
    name: params.name ?? 'New Chat',
    avatarUrl: params.avatarUrl ?? '',
    messages: params.messages ?? [],
    participants: params.participants ?? [],
    createdAt: params.createdAt ?? new Date().toISOString(),
  } as Chat;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export function createChatMessage(params: Partial<ChatMessage> = {}) {
  return {
    id: params.id ?? uuidv4(),
    content: params.content ?? '',
    userId: params.userId ?? 'Me',
    createdAt: params.createdAt ?? new Date().toISOString(),
  } as ChatMessage;
}

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
