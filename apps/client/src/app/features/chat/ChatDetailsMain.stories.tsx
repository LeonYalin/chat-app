import type { Meta, StoryObj } from '@storybook/react';
import { ChatDetailsMain } from './ChatDetailsMain';
import { noop } from '@client/utils/app.utils';
import { Chat } from '@shared/models/chat.model';
import { ChatMessage } from '@shared/models/chat.model';

const meta = {
  title: 'Chat Details Main',
  component: ChatDetailsMain,
} satisfies Meta<typeof ChatDetailsMain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chat: null,
    panelWidth: 300,
  },
};

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
    content: 'test',
    createdAt: new Date().toISOString(),
    chatUserId: '1',
  },
  {
    id: '2',
    content: 'test2',
    createdAt: new Date().toISOString(),
    chatUserId: '2',
  },
];

export const WithEmptyChat: Story = {
  args: {
    chat: chat,
    panelWidth: 300,
  },
};

export const ChatWithMessages: Story = {
  args: {
    chat: {
      ...chat,
      messages: [...messages],
    },
    panelWidth: 300,
  },
};
