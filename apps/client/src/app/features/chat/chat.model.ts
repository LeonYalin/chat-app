import { v4 as uuidv4 } from 'uuid';

export interface Chat {
  id: string;
  name: string;
  avatarUrl: string;
  messages: ChatMessage[];
  participants: ChatUser[];
  createdAt: number;
}

export function createChat(params: Partial<Chat> = {}) {
  return {
    id: params.id ?? uuidv4(),
    name: params.name ?? 'New Chat',
    avatarUrl: params.avatarUrl ?? '',
    messages: params.messages ?? [],
    participants: params.participants ?? [],
    createdAt: params.createdAt ?? Date.now(),
  } as Chat;
}

export interface ChatMessage {
  id: string;
  content: string;
  chatUserId: string;
  createdAt: number;
}

export function createChatMessage(params: Partial<ChatMessage> = {}) {
  return {
    id: params.id ?? uuidv4(),
    content: params.content ?? '',
    chatUserId: params.chatUserId ?? 'Me',
    createdAt: params.createdAt ?? Date.now(),
  } as ChatMessage;
}

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl: string;
}
