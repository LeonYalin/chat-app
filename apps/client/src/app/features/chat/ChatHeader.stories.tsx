import type { Meta, StoryObj } from '@storybook/react';
import { ChatHeader } from './ChatHeader';
import { Chat } from '@shared/models/chat.model';

const meta = {
  title: 'Chat Header',
  component: ChatHeader,
} satisfies Meta<typeof ChatHeader>;

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

export const Default: Story = {
  args: {
    chat,
  },
};
