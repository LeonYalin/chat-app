import type { Meta, StoryObj } from '@storybook/react';
import { ChatBody } from './ChatBody';
import { Chat, ChatMessage } from '@shared/models/chat.model';

const meta = {
  title: 'Chat Body',
  component: ChatBody,
} satisfies Meta<typeof ChatBody>;

export default meta;
type Story = StoryObj<typeof meta>;

const chat: Chat = {
  id: '1',
  name: 'Chat 1',
  avatarUrl: 'test',
  messages: [],
  participants: [],
  createdAt: new Date().toISOString(),
};

const messages: ChatMessage[] = [
  {
    id: '1',
    content: 'Test',
    userName: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: 'Test 2',
    userName: '2',
    createdAt: new Date().toISOString(),
  },
];

export const Default: Story = {
  args: {
    chat,
  },
};

export const WithMessages: Story = {
  args: {
    chat: {
      ...chat,
      messages,
    },
  },
};
