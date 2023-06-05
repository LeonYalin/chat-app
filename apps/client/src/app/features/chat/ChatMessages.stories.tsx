import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessages } from './ChatMessages';
import { ChatMessage } from '@shared/models/chat.model';

const meta = {
  title: 'Chats Messages',
  component: ChatMessages,
} satisfies Meta<typeof ChatMessages>;

export default meta;
type Story = StoryObj<typeof meta>;

const messages: ChatMessage[] = [
  {
    id: '1',
    content: 'Test',
    chatUserId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    content: 'Test 2',
    chatUserId: '2',
    createdAt: new Date().toISOString(),
  },
];

export const Default: Story = {
  args: {
    messages,
  },
};
